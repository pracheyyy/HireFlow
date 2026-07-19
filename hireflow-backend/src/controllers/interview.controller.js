const InterviewSession = require("../models/interviewSession.model");
const { ALL_QUESTIONS, HR_QUESTIONS, TECHNICAL_QUESTIONS, TOPICS } = require("../data/interviewQuestions");
const { evaluateInterview } = require("../services/interviewAnalysis.service");
const { asyncHandler } = require("../middleware/error.middleware");

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// GET /api/interview/topics — lets the frontend build a topic picker
const getTopics = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: TOPICS });
});

// GET /api/interview/questions?type=hr|technical&topic=&count=5
// Never sends expectedKeywords to the client — that's the answer key.
const getQuestions = asyncHandler(async (req, res) => {
  const { type, topic, count = 5 } = req.query;
  const numCount = Math.min(10, Math.max(1, Number(count) || 5));

  let pool;
  if (type === "hr") {
    pool = HR_QUESTIONS;
  } else if (type === "technical") {
    pool = topic ? TECHNICAL_QUESTIONS.filter((q) => q.topic === topic) : TECHNICAL_QUESTIONS;
  } else {
    pool = ALL_QUESTIONS;
  }

  if (pool.length === 0) {
    const err = new Error("No questions found for that type/topic combination.");
    err.statusCode = 400;
    throw err;
  }

  const selected = shuffle(pool).slice(0, numCount);
  const sanitized = selected.map(({ expectedKeywords, ...rest }) => rest);

  res.status(200).json({ success: true, data: sanitized });
});

// POST /api/interview/submit
// body: { interviewType, topic, answers: [{ questionId, answerText }] }
const submitInterview = asyncHandler(async (req, res) => {
  const { interviewType, topic, answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    const err = new Error("No answers submitted.");
    err.statusCode = 400;
    throw err;
  }

  // Look up each question server-side so the expectedKeywords (answer key)
  // is never trusted from the client — only questionId + answerText are.
  const answeredQuestions = answers.map(({ questionId, answerText }) => {
    const question = ALL_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      const err = new Error(`Unknown question ID: ${questionId}`);
      err.statusCode = 400;
      throw err;
    }
    return { ...question, answerText };
  });

  const { results, overallScore } = evaluateInterview(answeredQuestions);

  const session = await InterviewSession.create({
    user: req.user._id,
    interviewType: interviewType || "mixed",
    topic: topic || "general",
    results,
    overallScore,
  });

  res.status(201).json({ success: true, message: "Interview evaluated", data: session });
});

// GET /api/interview/latest
const getLatestSession = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: session || null });
});

// GET /api/interview/history
const getSessionHistory = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-results.answerText"); // history list doesn't need full answer text
  res.status(200).json({ success: true, data: sessions });
});

module.exports = { getTopics, getQuestions, submitInterview, getLatestSession, getSessionHistory };

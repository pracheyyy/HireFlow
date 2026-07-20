const Resume = require("../models/resume.model");
const InterviewSession = require("../models/interviewSession.model");
const CodingEntry = require("../models/codingEntry.model");
const { computeStreaks, groupByField } = require("../services/codingStats.service");
const { computeReadinessScore } = require("../services/readinessScore.service");
const { asyncHandler } = require("../middleware/error.middleware");

// GET /api/analytics/overview
const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [resumeHistory, interviewHistory, codingEntries] = await Promise.all([
    Resume.find({ user: userId }).sort({ createdAt: 1 }).select("atsScore createdAt fileName"),
    InterviewSession.find({ user: userId }).sort({ createdAt: 1 }).select("overallScore createdAt interviewType topic"),
    CodingEntry.find({ user: userId }).select("topic difficulty solvedAt"),
  ]);

  const latestResumeScore = resumeHistory.length > 0 ? resumeHistory[resumeHistory.length - 1].atsScore : null;

  const avgInterviewScore =
    interviewHistory.length > 0
      ? Math.round(interviewHistory.reduce((sum, s) => sum + s.overallScore, 0) / interviewHistory.length)
      : null;

  const { currentStreak, longestStreak } = computeStreaks(codingEntries.map((e) => e.solvedAt));
  const topicBreakdown = groupByField(codingEntries, "topic");

  // "Complete" mirrors the same heuristic used to gate /complete-profile —
  // has at least one skill or one education entry filled in.
  const profileComplete = (req.user.skills?.length > 0) || (req.user.education?.length > 0);

  const { overallScore, breakdown } = computeReadinessScore({
    resumeScore: latestResumeScore,
    avgInterviewScore,
    totalSolved: codingEntries.length,
    profileComplete,
  });

  res.status(200).json({
    success: true,
    data: {
      readinessScore: overallScore,
      readinessBreakdown: breakdown,
      resume: {
        latestScore: latestResumeScore,
        history: resumeHistory.map((r) => ({ date: r.createdAt, score: r.atsScore, fileName: r.fileName })),
      },
      interview: {
        avgScore: avgInterviewScore,
        totalSessions: interviewHistory.length,
        history: interviewHistory.map((s) => ({ date: s.createdAt, score: s.overallScore, type: s.interviewType, topic: s.topic })),
      },
      coding: {
        totalSolved: codingEntries.length,
        currentStreak,
        longestStreak,
        topicBreakdown,
      },
      profileComplete,
    },
  });
});

module.exports = { getOverview };

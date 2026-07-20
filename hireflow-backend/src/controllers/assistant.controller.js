const AssistantMessage = require("../models/assistantMessage.model");
const { KNOWLEDGE_BASE, CATEGORIES } = require("../data/assistantKnowledgeBase");
const { matchQuery } = require("../services/assistantMatch.service");
const { asyncHandler } = require("../middleware/error.middleware");

const FALLBACK_RESPONSE =
  "I don't have a canned answer for that yet. I can help with resume tips, interview prep (HR and technical), " +
  "role roadmaps (frontend, backend, full-stack, data, DevOps), and general placement advice like aptitude tests " +
  "or group discussions — try rephrasing around one of those topics.";

// GET /api/assistant/categories
const getCategories = asyncHandler(async (req, res) => {
  // A few representative questions per category, useful as clickable prompts on the frontend
  const suggestions = CATEGORIES.map((category) => ({
    category,
    examples: KNOWLEDGE_BASE.filter((k) => k.category === category).slice(0, 3).map((k) => k.question),
  }));
  res.status(200).json({ success: true, data: suggestions });
});

// POST /api/assistant/ask   body: { message }
const askAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    const err = new Error("Message is required.");
    err.statusCode = 400;
    throw err;
  }

  const trimmed = message.trim().slice(0, 1000); // guard against absurdly long input
  const { match, alternatives } = matchQuery(trimmed, KNOWLEDGE_BASE);

  const responseText = match ? match.response : FALLBACK_RESPONSE;

  await AssistantMessage.create({ user: req.user._id, role: "user", text: trimmed });
  const assistantMsg = await AssistantMessage.create({
    user: req.user._id,
    role: "assistant",
    text: responseText,
    matchedEntryId: match ? match.id : null,
    category: match ? match.category : null,
  });

  res.status(200).json({
    success: true,
    data: {
      response: responseText,
      matched: !!match,
      category: match ? match.category : null,
      suggestedFollowUps: match
        ? []
        : alternatives.map((a) => a.question), // if no confident match, suggest closest topics
      messageId: assistantMsg._id,
    },
  });
});

// GET /api/assistant/history
const getHistory = asyncHandler(async (req, res) => {
  const messages = await AssistantMessage.find({ user: req.user._id }).sort({ createdAt: 1 }).limit(100);
  res.status(200).json({ success: true, data: messages });
});

module.exports = { getCategories, askAssistant, getHistory };

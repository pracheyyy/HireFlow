const CodingEntry = require("../models/codingEntry.model");
const { computeStreaks, buildHeatmap, groupByField, todayCount } = require("../services/codingStats.service");
const { asyncHandler } = require("../middleware/error.middleware");

// POST /api/coding/entries
const createEntry = asyncHandler(async (req, res) => {
  const { title, platform, topic, difficulty, notes, solvedAt } = req.body;

  if (!title || !title.trim()) {
    const err = new Error("Problem title is required.");
    err.statusCode = 400;
    throw err;
  }

  const entry = await CodingEntry.create({
    user: req.user._id,
    title: title.trim(),
    platform,
    topic,
    difficulty,
    notes,
    solvedAt: solvedAt ? new Date(solvedAt) : new Date(),
  });

  res.status(201).json({ success: true, message: "Logged", data: entry });
});

// GET /api/coding/entries
const listEntries = asyncHandler(async (req, res) => {
  const entries = await CodingEntry.find({ user: req.user._id }).sort({ solvedAt: -1 }).limit(200);
  res.status(200).json({ success: true, data: entries });
});

// DELETE /api/coding/entries/:id
const deleteEntry = asyncHandler(async (req, res) => {
  const entry = await CodingEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!entry) {
    const err = new Error("Entry not found.");
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, message: "Deleted" });
});

// GET /api/coding/stats
const getStats = asyncHandler(async (req, res) => {
  const entries = await CodingEntry.find({ user: req.user._id }).select("topic difficulty platform solvedAt");

  const { currentStreak, longestStreak } = computeStreaks(entries.map((e) => e.solvedAt));
  const heatmap = buildHeatmap(entries, 90);
  const topicBreakdown = groupByField(entries, "topic");
  const difficultyBreakdown = groupByField(entries, "difficulty");
  const platformBreakdown = groupByField(entries, "platform");
  const solvedToday = todayCount(entries);

  res.status(200).json({
    success: true,
    data: {
      totalSolved: entries.length,
      currentStreak,
      longestStreak,
      solvedToday,
      heatmap,
      topicBreakdown,
      difficultyBreakdown,
      platformBreakdown,
    },
  });
});

module.exports = { createEntry, listEntries, deleteEntry, getStats };

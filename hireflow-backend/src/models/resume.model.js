const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    wordCount: {
      type: Number,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      contactInfo: { type: Number, default: 0 },
      sectionsCoverage: { type: Number, default: 0 },
      lengthScore: { type: Number, default: 0 },
      bulletUsage: { type: Number, default: 0 },
      actionVerbs: { type: Number, default: 0 },
      quantifiedAchievements: { type: Number, default: 0 },
      keywordCoverage: { type: Number, default: 0 },
    },
    sectionsFound: {
      type: [String],
      default: [],
    },
    sectionsMissing: {
      type: [String],
      default: [],
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    profileSkillsNotInResume: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    hasEmail: { type: Boolean, default: false },
    hasPhone: { type: Boolean, default: false },
    actionVerbCount: { type: Number, default: 0 },
    quantifiedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);

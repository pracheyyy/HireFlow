const mongoose = require("mongoose");

const questionResultSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, enum: ["hr", "technical"], required: true },
    topic: { type: String, required: true },
    answerText: { type: String, default: "" },
    score: { type: Number, required: true }, // out of 10
    wordCount: { type: Number, default: 0 },
    matchedKeywords: { type: [String], default: undefined },
    missedKeywords: { type: [String], default: undefined },
    starStagesHit: { type: Number, default: undefined },
    fillerCount: { type: Number, default: undefined },
    feedback: { type: [String], default: [] },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    interviewType: {
      type: String,
      enum: ["hr", "technical", "mixed"],
      required: true,
    },
    topic: {
      type: String,
      default: "general",
    },
    results: {
      type: [questionResultSchema],
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);

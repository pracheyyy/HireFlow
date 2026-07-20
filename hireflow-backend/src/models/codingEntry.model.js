const mongoose = require("mongoose");

const TOPICS = [
  "Arrays", "Strings", "Linked List", "Stacks & Queues", "Trees", "Graphs",
  "Dynamic Programming", "Recursion & Backtracking", "Sorting & Searching",
  "Greedy", "Hashing", "Bit Manipulation", "Math", "Other",
];

const codingEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
    },
    platform: {
      type: String,
      enum: ["LeetCode", "CodeChef", "Codeforces", "HackerRank", "GeeksforGeeks", "Other"],
      default: "Other",
    },
    topic: {
      type: String,
      enum: TOPICS,
      default: "Other",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    notes: {
      type: String,
      default: "",
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

codingEntrySchema.index({ user: 1, solvedAt: -1 });

module.exports = mongoose.model("CodingEntry", codingEntrySchema);
module.exports.TOPICS = TOPICS;

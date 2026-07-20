const mongoose = require("mongoose");

const assistantMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    matchedEntryId: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

assistantMessageSchema.index({ user: 1, createdAt: 1 });

module.exports = mongoose.model("AssistantMessage", assistantMessageSchema);

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getTopics,
  getQuestions,
  submitInterview,
  getLatestSession,
  getSessionHistory,
} = require("../controllers/interview.controller");

router.get("/topics", protect, getTopics);
router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitInterview);
router.get("/latest", protect, getLatestSession);
router.get("/history", protect, getSessionHistory);

module.exports = router;

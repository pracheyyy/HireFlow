const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { uploadResume, getLatestResume, getResumeHistory } = require("../controllers/resume.controller");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/latest", protect, getLatestResume);
router.get("/history", protect, getResumeHistory);

module.exports = router;

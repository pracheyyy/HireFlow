const Resume = require("../models/resume.model");
const { analyzeResume } = require("../services/resumeAnalysis.service");
const { extractPdfText } = require("../utils/pdfExtract");
const { asyncHandler } = require("../middleware/error.middleware");

// POST /api/resume/upload  (multipart/form-data, field name "resume")
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error("No file uploaded. Attach a PDF under the 'resume' field.");
    err.statusCode = 400;
    throw err;
  }

  let text;
  try {
    text = await extractPdfText(req.file.buffer);
  } catch (e) {
    const err = new Error("Couldn't read that PDF — make sure it's not corrupted or password-protected.");
    err.statusCode = 422;
    throw err;
  }
  if (text.trim().length < 30) {
    const err = new Error("This PDF has almost no extractable text. If it's a scanned image, try a text-based PDF instead.");
    err.statusCode = 422;
    throw err;
  }

  const profileSkills = req.user.skills || [];
  const analysis = analyzeResume(text, profileSkills);

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    fileSizeBytes: req.file.size,
    extractedText: text.slice(0, 20000), // cap stored text size
    ...analysis,
  });

  res.status(201).json({ success: true, message: "Resume analyzed", data: resume });
});

// GET /api/resume/latest
const getLatestResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: resume || null });
});

// GET /api/resume/history
const getResumeHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-extractedText"); // history list doesn't need full text payload
  res.status(200).json({ success: true, data: resumes });
});

module.exports = { uploadResume, getLatestResume, getResumeHistory };

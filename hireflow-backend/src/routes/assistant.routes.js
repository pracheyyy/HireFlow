const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getCategories, askAssistant, getHistory } = require("../controllers/assistant.controller");

router.get("/categories", protect, getCategories);
router.post("/ask", protect, askAssistant);
router.get("/history", protect, getHistory);

module.exports = router;

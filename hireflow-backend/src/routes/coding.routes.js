const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { createEntry, listEntries, deleteEntry, getStats } = require("../controllers/coding.controller");

router.post("/entries", protect, createEntry);
router.get("/entries", protect, listEntries);
router.delete("/entries/:id", protect, deleteEntry);
router.get("/stats", protect, getStats);

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getOverview } = require("../controllers/analytics.controller");

router.get("/overview", protect, getOverview);

module.exports = router;

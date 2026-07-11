const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
} = require("../controllers/auth.controller");

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validators/auth.validator");

const { protect, authorize } = require("../middleware/auth.middleware");

// Stricter limiter for brute-force-prone endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, registerValidation, register);
router.post("/login", authLimiter, loginValidation, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);

router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", authLimiter, forgotPasswordValidation, forgotPassword);
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);

router.get("/me", protect, getMe);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
  googleCallback
);

// Example of role-protected route (admin-only)
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({ success: true, message: `Welcome, admin ${req.user.name}` });
});

module.exports = router;

const authService = require("../services/auth.service");
const { asyncHandler } = require("../middleware/error.middleware");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { refreshExpiresInMs } = require("../config/jwt");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "strict",
  maxAge: refreshExpiresInMs,
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  isVerified: user.isVerified,
  provider: user.provider,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "Registration successful. Please check your email to verify your account.",
    data: sanitizeUser(user),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: sanitizeUser(user), accessToken },
  });
});

// POST /api/auth/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);

  res.status(200).json({ success: true, data: { accessToken } });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await authService.logoutUser(req.user._id);
  }
  res.clearCookie("refreshToken", cookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params.token);
  res.status(200).json({ success: true, message: "Email verified successfully. You can now log in." });
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: "If an account with that email exists, a reset link has been sent.",
  });
});

// POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  res.status(200).json({ success: true, message: "Password reset successful. Please log in." });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: sanitizeUser(req.user) });
});

// GET /api/auth/google/callback  (after passport.authenticate("google") succeeds)
const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, cookieOptions);

  // Redirect back to frontend with the access token (frontend stores it in memory/redux)
  res.redirect(`${process.env.CLIENT_URL}/oauth/success?accessToken=${accessToken}`);
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
};

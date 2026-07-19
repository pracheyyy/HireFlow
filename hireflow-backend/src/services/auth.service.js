const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken, generateRandomToken } = require("../utils/generateToken");
const { sendPasswordResetEmail } = require("./email.service");
const { refreshSecret } = require("../config/jwt");

const SALT_ROUNDS = 12;

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error("An account with this email already exists");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true, // email verification disabled — no email service required to use the app
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (token) => {
  if (!token) {
    const err = new Error("Refresh token missing");
    err.statusCode = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, refreshSecret);
  } catch (err) {
    err.statusCode = 401;
    err.message = "Invalid or expired refresh token";
    throw err;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    const err = new Error("Refresh token invalid or reused");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user._id, user.role);
  return { accessToken, user };
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: "" });
};

const verifyEmail = async (rawToken) => {
  const crypto = require("crypto");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    const err = new Error("Verification link is invalid or has expired");
    err.statusCode = 400;
    throw err;
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return user;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  // Don't reveal whether the email exists - always resolve silently
  if (!user) return;

  const { rawToken, hashedToken } = generateRandomToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save();

  await sendPasswordResetEmail(email, rawToken);
};

const resetPassword = async (rawToken, newPassword) => {
  const crypto = require("crypto");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    const err = new Error("Reset link is invalid or has expired");
    err.statusCode = 400;
    throw err;
  }

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = ""; // force re-login everywhere after password reset
  await user.save();

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

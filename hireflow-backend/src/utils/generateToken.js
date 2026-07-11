const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  accessSecret,
  refreshSecret,
  accessExpiresIn,
  refreshExpiresIn,
} = require("../config/jwt");

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, accessSecret, {
    expiresIn: accessExpiresIn,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });
};

// Used for email verification & password reset links (not JWTs - opaque random tokens)
const generateRandomToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
};

module.exports = { generateAccessToken, generateRefreshToken, generateRandomToken };

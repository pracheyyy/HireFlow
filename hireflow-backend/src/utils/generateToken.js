const jwt = require("jsonwebtoken");
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
 
module.exports = { generateAccessToken, generateRefreshToken };


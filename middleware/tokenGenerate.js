const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

function generateResetToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '15m', // 15 minutes validity
  });
}
module.exports = { signAccessToken, generateResetToken };
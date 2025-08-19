const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "your_secret_key"; // keep in env

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // token valid 1 hour
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

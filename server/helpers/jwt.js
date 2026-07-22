require("dotenv").config();
const jwt = require("jsonwebtoken");
const private_key = process.env.JWT_KEY;

const signToken = (payload) => {
  return jwt.sign(payload, private_key);
};

const verifyToken = (token) => {
  return jwt.verify(token, private_key);
};

module.exports = { signToken, verifyToken };

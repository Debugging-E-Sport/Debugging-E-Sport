const jwt = require("jsonwebtoken");
const private_key = process.env.JWT_KEY;

if (!private_key) {
  throw new Error("JWT_KEY environment variable is not set");
}

const signToken = (payload) => {
  return jwt.sign(payload, private_key, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, private_key);
};

module.exports = { signToken, verifyToken };

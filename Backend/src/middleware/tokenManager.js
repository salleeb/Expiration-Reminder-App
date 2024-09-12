require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const invalidatedTokens = [];

const isTokenInvalidated = (token) => {
  return invalidatedTokens.includes(token);
};

const invalidateToken = (token) => {
  invalidatedTokens.push(token);
};

const verifyToken = (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "YOU MUST LOG IN" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "YOU MUST LOG IN" });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};

module.exports = {
  invalidatedTokens,
  isTokenInvalidated,
  invalidateToken,
  verifyToken,
};

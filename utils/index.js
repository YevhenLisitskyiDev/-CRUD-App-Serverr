const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const handleError = (callback, errorMessage) => {
  return async (req, res) => {
    try {
      await callback(req, res);
    } catch (error) {
      res.status(500).json({ message: errorMessage, error: error.message });
    }
  };
};

const generateToken = (payload) => {
  return jwt.sign(payload, config.get("DATABASE.JWTSECRET"), {
    expiresIn: "30d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.get("DATABASE.JWTSECRET"));
};

const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const verifyPassword = async (passwordToVerify, password) => {
  return await bcrypt.compare(passwordToVerify, password);
};

const getDate = (date) => {
  const [year, month, day] = date.split("-");
  return new Date(year, month - 1, day)
};

module.exports = {
  handleError,
  generateToken,
  verifyToken,
  generateHashedPassword,
  verifyPassword,
  getDate,
};

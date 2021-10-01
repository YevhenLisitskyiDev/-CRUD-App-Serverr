const { verifyToken } = require("../utils/index");

const authMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  console.log("adminself");
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "error" });

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = authMiddleware;

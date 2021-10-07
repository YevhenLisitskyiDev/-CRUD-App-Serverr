const { verifyToken } = require("../utils/index");

const authMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    if (!req.headers.authorization)
      return res.status(401).json({ message: "Unauthorized" });

    const token = req.headers.authorization.split(" ")[1];    

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = authMiddleware;

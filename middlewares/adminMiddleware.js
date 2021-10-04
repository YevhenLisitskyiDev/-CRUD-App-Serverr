const User = require("../models/UserModel");

const adminMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const user = await User.findById(req.user.id);
    const { isAdmin } = user;
    if (!isAdmin)
      return res.status(403).json({ message: "Only admin has access to this" });
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = adminMiddleware;

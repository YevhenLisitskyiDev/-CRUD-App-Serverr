const adminMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const { isAdmin } = req.user;
    if (!isAdmin)
      return res.status(400).json({ message: "Only admin has access to this" });
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = adminMiddleware;

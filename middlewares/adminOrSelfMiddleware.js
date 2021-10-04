const adminOrSelfMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const { isAdmin, id } = req.user;    
    if (!(isAdmin || req.params.id === id))
      return res.status(403).json({
        message: "Only admin or this user has access to this",
      });
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = adminOrSelfMiddleware;

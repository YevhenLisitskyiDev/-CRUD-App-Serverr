const { Router } = require("express");
const { getAllStats } = require("../controllers/StatsController");
const { authMiddleware, adminMiddleware } = require("../middlewares/index");
const router = new Router();

router.get("/", authMiddleware, adminMiddleware, getAllStats);

module.exports = router;

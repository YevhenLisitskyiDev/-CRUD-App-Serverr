const { Router } = require("express");
const {
  getUserProfiles,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/ProfileController");
const {
  authMiddleware,
  adminMiddleware,
  adminOrSelfMiddleware,
} = require("../middlewares");

const router = new Router();

router.get("/all", authMiddleware, adminMiddleware, getAllProfiles);
router.get("/user/:id", authMiddleware, adminOrSelfMiddleware, getUserProfiles);
router.post("/create/:id",authMiddleware,adminOrSelfMiddleware,createProfile);
router.put("/update/:id/:profileId",authMiddleware,adminOrSelfMiddleware,updateProfile);
router.delete("/delete/:id/:profileId",authMiddleware,adminOrSelfMiddleware,deleteProfile);

module.exports = router;

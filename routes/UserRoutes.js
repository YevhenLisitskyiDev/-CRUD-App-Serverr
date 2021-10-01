const { Router } = require("express");
const {
  authMiddleware,
  adminMiddleware,
  adminOrSelfMiddleware,
} = require("../middlewares/index");
const {
  getUserById,
  getAllUsers,
  createUser,
  loginUser,
  authUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const router = new Router();

router.get("/all", authMiddleware, adminMiddleware, getAllUsers);
router.get("/auth", authMiddleware, authUser);
router.get("/find/:id",authMiddleware, adminMiddleware,adminOrSelfMiddleware,getUserById);
router.put("/update/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);

router.post("/login", loginUser);
router.post("/create", createUser);

module.exports = router;

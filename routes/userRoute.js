const express = require("express");
const router = express.Router();
const { getAllUsers,getUserById,getUserDetail, createUser,updateUser,deleteUser,updateUserStatus } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllUsers);
router.get("/profile", protect, getUserById);
router.post("/", protect, createUser);
router.get("/:id", protect, getUserDetail);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.put("/:id/status", protect, updateUserStatus);

module.exports = router;
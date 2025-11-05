const express = require("express");
const router = express.Router();
const { getAllUsers,getUserById,createUser,updateUser,deleteUser,updateUserStatus } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllUsers);
router.get("/profile", protect, getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/status", updateUserStatus);

module.exports = router;
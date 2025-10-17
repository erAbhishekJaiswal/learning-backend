const express = require("express");
const router = express.Router();
const { getAllUsers,getUserById,createUser,updateUser } = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/profile", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);

module.exports = router;
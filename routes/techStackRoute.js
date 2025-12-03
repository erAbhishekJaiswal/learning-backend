const express = require("express");
const router = express.Router();
const {
    getAllTechStack,
    getCategoryById,
    createTechStack,
    getSubCategory,
    updateTechStack,
    deleteTechStack,
} = require("../controllers/techStackController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllTechStack);
router.get("/:id", getCategoryById);
router.get("/:id/:subCategoryName", getSubCategory);
router.post("/", protect, createTechStack);
router.put("/:id", protect, updateTechStack);
router.delete("/:id", protect, deleteTechStack);

module.exports = router;
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

router.get("/", getAllTechStack);
router.get("/:id", getCategoryById);
router.get("/:id/:subCategoryName", getSubCategory);
router.post("/", createTechStack);
router.put("/:id", updateTechStack);
router.delete("/:id", deleteTechStack);

module.exports = router;
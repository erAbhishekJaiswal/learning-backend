const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  uploadThumbnail,
  uploadEbook,
  getBooksByTechStack,
  getBooksByCategory,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.put("/thumbnail/:id", protect, uploadThumbnail);
router.put("/ebook/:id", protect, uploadEbook);
router.get("/techstack/:techStackId", getBooksByTechStack);
router.get("/category/:categoryId", getBooksByCategory);

module.exports = router;

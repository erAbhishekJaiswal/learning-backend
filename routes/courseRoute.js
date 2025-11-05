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

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.put("/thumbnail/:id", uploadThumbnail);
router.put("/ebook/:id", uploadEbook);
router.get("/techstack/:techStackId", getBooksByTechStack);
router.get("/category/:categoryId", getBooksByCategory);

module.exports = router;

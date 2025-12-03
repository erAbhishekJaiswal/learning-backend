const express = require("express");
const {
  createTest,
  addQuestion,
  getAllTests,
  getTestForAttempt,
  submitTest,
  deleteTest,
  getTestResults,
  deleteTestResult,
  getTestList,
  deleteAllTestResult,
  getCertificateById,
  updateTest
} = require("../controllers/testController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/", protect, createTest);
router.post("/:testId/questions", protect, addQuestion);
router.get("/attempt/tests", protect, getTestList);
router.get("/", protect, getAllTests);
router.get("/:bookId", protect, getTestForAttempt);
router.get("/attempts/:id/certificate", protect,  getCertificateById);
router.get("/:testId/attempt", protect, getTestResults);
router.put('/:testId', protect, updateTest)
router.delete("/:attemptId", protect, deleteTestResult);
router.delete("/alltests/attempt", protect, deleteAllTestResult);
router.post("/:testId/submit", protect, submitTest);
router.delete("/:testId", protect, deleteTest);
module.exports = router;

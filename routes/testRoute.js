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
  getCertificateById
} = require("../controllers/testController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/", createTest);
router.post("/:testId/questions", addQuestion);
router.get("/attempt/tests", getTestList);
router.get("/", getAllTests);
router.get("/:bookId", getTestForAttempt);
router.get("/attempts/:id/certificate",  getCertificateById);
router.get("/:testId/attempt", protect, getTestResults);
router.delete("/:attemptId", deleteTestResult);
router.delete("/alltests/attempt", deleteAllTestResult);
router.post("/:testId/submit", protect, submitTest);
router.delete("/:testId", deleteTest);
module.exports = router;

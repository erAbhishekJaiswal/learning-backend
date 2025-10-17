const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
testid: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  score: Number,
  total: Number,
  passed: Boolean,
  attemptDate: { type: Date, default: Date.now },
  timeTaken: Number,
  feedback: String,
  attemptNumber: Number
});

module.exports = mongoose.model("TestResult", testResultSchema);

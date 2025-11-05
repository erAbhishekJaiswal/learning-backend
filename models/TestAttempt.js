// models/TestAttempt.js
const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalQuestions: Number,
  correct: Number,
  wrong: Number,
  scorePercentage: Number,
  passed: Boolean,
  certificateUrl: String,
  attemptedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model("TestAttempt", testAttemptSchema);

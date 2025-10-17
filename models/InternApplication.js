const mongoose = require("mongoose");

const internAppSchema = new mongoose.Schema({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Pending", "Selected", "Rejected"], default: "Pending" },
  feedback: String,
  appliedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  interviewDate: Number
});

module.exports = mongoose.model("InternApplication", internAppSchema);

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeLink: String,
  certificateLinks: [String],
  status: { type: String, enum: ["Pending", "Reviewed", "Accepted", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
  reviewedBy:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  interviewDate:{
    type:String
  }
});

module.exports = mongoose.model("Application", applicationSchema);

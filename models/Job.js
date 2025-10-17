const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  industryType:  { type: String, required: true },
  mode: String, // (onsite, remote, hybrid)
  experienceLevel: String,
  location: String,
  description: String,
  requirements: [String],
  salaryRange: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin or Partner
  postedAt: { type: Date, default: Date.now },
  deadline: Date,
});

module.exports = mongoose.model("Job", jobSchema);

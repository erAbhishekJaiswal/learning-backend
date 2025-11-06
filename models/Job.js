const mongoose = require("mongoose");

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   companyName: { type: String, required: true },
//   industryType:  { type: String, required: true },
//   mode: String, // (onsite, remote, hybrid)
//   experienceLevel: String,
//   location: String,
//   description: String,
//   requirements: [String],
//   salaryRange: String,
//   postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin or Partner
//   postedAt: { type: Date, default: Date.now },
//   deadline: Date,
// });

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  location: { type: String },
  salaryRange: { type: String }, // e.g., "$120,000 - $150,000"
  jobType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"], default: "Full-time" },
  description: { type: String },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  perks: [{ type: String }], // e.g., ["Remote work flexibility", "Career growth"]
  experienceLevel: { type: String }, // e.g., "Senior"
  skillsRequired: [{ type: String }], // e.g., ["React", "JavaScript", "TypeScript"]
  education: { type: String }, // e.g., "Bachelor's degree in Computer Science"
  postedDate: { type: Date, default: Date.now },
  applyLink: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model("Job", jobSchema);

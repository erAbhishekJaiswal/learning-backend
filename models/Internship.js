const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: String,
  industryType:String,
  mode:String,
  experienceLevel:String,
  description: String,
  duration: String,
  stipend: String,
  skillsRequired: [String],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postedAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("Internship", internshipSchema);

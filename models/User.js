const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "mentor", "employer"], default: "student" },
  phone: String,
  profileImage: String,
  location: String,
  skills: [String],
//   enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  readbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  internApplications: [{ type: mongoose.Schema.Types.ObjectId, ref: "InternApplication" }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
  totalTests: Number,
  totalBooksRead: Number,
  resumeLink: String,
  createdAt: { type: Date, default: Date.now },
  curruntStatus: { type: String, enum: ["active", "inactive"], default: "active" },
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


module.exports = mongoose.model("User", userSchema);

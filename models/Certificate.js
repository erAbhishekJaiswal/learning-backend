const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//   bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },

techstackId: { type: mongoose.Schema.Types.ObjectId, ref: "TechStack", required: true },
techstacksubCategory:{
  type:String
},
  certificateName: String,
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  verificationURL: String,
  status: { type: String, enum: ["valid", "expired"], default: "valid" },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  grade:{ type: String }
});

module.exports = mongoose.model("Certificate", certificateSchema);

// const mongoose = require("mongoose"); 
// const courseSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   description: String,
//   level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
//   thumbnail: String,
//   contentLinks: [String], // eBooks or video URLs
//   liveCodeEnabled: { type: Boolean, default: true },
//   test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Course", courseSchema);















const mongoose = require("mongoose"); 

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  techStack: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "TechStack",
    required: true 
  },
  techStackSubcategory: { 
    type: String, 
    required: true 
  },
  description: String,
  level: { 
    type: String, 
    enum: ["Beginner", "Intermediate", "Advanced"], 
    default: "Beginner" 
  },
  thumbnail: String,
  contentLinks: [String], // eBooks or video URLs
  eBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }],
  liveCodeEnabled: { type: Boolean, default: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: false },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  duration: Number, // in hours
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Course", courseSchema);

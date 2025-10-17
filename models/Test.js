// const testSchema = new mongoose.Schema({
// //   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
// bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
//   totalQuestions: { type: Number, default: 30 },
//   questions: [
//     {
//       question: String,
//       options: [String],
//       correctAnswer: Number, // index of correct option
//     },
//   ],
//   passingScore: { type: Number, default: 60 },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Test", testSchema);







const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  techstackId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TechStack", required: true 
  },
  subcategory: {
      type: String,
      required: true, // e.g., "React.js"
    },
  totalQuestions: { type: Number, default: 30 },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
  duration: Number,
  difficulty: String, // (easy, medium, hard)
  passingScore: { type: Number, default: 60 },
  createdBy:{
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", 
     required: true
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Test", testSchema);

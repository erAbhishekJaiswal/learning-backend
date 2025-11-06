// const mongoose = require("mongoose");

// const testSchema = new mongoose.Schema({
//   bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
//   techstackId:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "TechStack", required: true 
//   },
//   subcategory: {
//       type: String,
//       required: true, // e.g., "React.js"
//     },
//   totalQuestions: { type: Number, default: 30 },
//   questions: [
//     {
//       question: String,
//       options: [String],
//       correctAnswer: Number,
//     },
//   ],
//   duration: Number,
//   difficulty: String, // (easy, medium, hard)
//   passingScore: { type: Number, default: 60 },
//   createdBy:{
//      type: mongoose.Schema.Types.ObjectId, 
//      ref: "User", 
//      required: true
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Test", testSchema);







const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"]
  },
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: [(val) => val.length >= 2, "At least two options required"]
  },
  correctAnswer: {
    type: Number,
    required: [true, "Correct answer index is required"],
    select: false // hide in responses
  },
  explanation: {
    type: String,
    trim: true
  },
  marks: {
    type: Number,
    default: 1
  }
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Test title is required"],
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    instructions: {
      type: String,
      trim: true
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"]
    },

    techstackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechStack",
      required: [true, "Tech stack reference is required"]
    },

    // stores subcategory _id for that tech stack
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechStack",
      required: [true, "Subcategory is required"]
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Hard"],
      default: "Beginner"
    },

    totalQuestions: {
      type: Number,
      default: 30,
      min: [1, "There must be at least one question"]
    },

    duration: {
      type: Number,
      default: 30, // in minutes
      min: [5, "Minimum duration is 5 minutes"]
    },

    passingScore: {
      type: Number,
      default: 60,
      min: [0, "Passing score cannot be below 0"],
      max: [100, "Passing score cannot exceed 100"]
    },

    questions: [questionSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // auto-manages createdAt & updatedAt
  }
);

// Automatically update `totalQuestions` count before saving
testSchema.pre("save", function (next) {
  if (this.questions) {
    this.totalQuestions = this.questions.length;
  }
  next();
});

module.exports = mongoose.model("Test", testSchema);





// models/Test.js
// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: [{ type: String, required: true }],
//   correctAnswer: { type: Number, required: true, select: false }, // hidden
//   explanation: { type: String },
//   marks: { type: Number, default: 1 }
// });

// const testSchema = new mongoose.Schema({
//   title: { type: String},
//   bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
//   techstackId: { type: mongoose.Schema.Types.ObjectId, ref: "TechStack" },
//   subcategory: {
//     type: String,
//     required: true,
//   },
//   questions: [questionSchema],
//   totalQuestions: { type: Number, default: 30 },
//   duration: { type: Number, default: 30 }, // in minutes
//   difficulty: { type: String, enum: [ "Beginner", "Intermediate", "Advanced", "Hard"], default: "Beginner" },
//   passingScore: { type: Number, default: 60 },
//   instructions: { type: String },
//   description: { type: String },
//   // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Test", testSchema);


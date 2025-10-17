// import mongoose from "mongoose";

// const bookSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     author: {
//       type: String,
//       trim: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     //   connect to tech stack
//     //   enum: [
//     //     "HTML",
//     //     "CSS",
//     //     "JavaScript",
//     //     "Python",
//     //     "Cybersecurity",
//     //     "AI/ML",
//     //     "Networking",
//     //     "Others",
//     //   ],
//     },
//     description: {
//       type: String,
//       maxlength: 2000,
//     },
//     coverImage: {
//       type: String, // URL to cover image (stored on Cloudinary/AWS)
//     },
//     fileUrl: {
//       type: String, // URL of book (non-downloadable PDF/HTML content)
//       required: true,
//     },
//     // level: {
//     //   type: String,
//     //   enum: ["Beginner", "Intermediate", "Advanced"],
//     //   default: "Beginner",
//     // },
//     language: {
//       type: String,
//       default: "English",
//     },
//     tags: [
//       {
//         type: String,
//       },
//     ],
//     totalChapters: {
//       type: Number,
//       default: 0,
//     },
//     // skillTestId: {
//     //   type: mongoose.Schema.Types.ObjectId,
//     //   ref: "Test",
//     //   default: null,
//     // },
//     aiSummary: {
//       type: String, // Generated summary using AI layer
//     },
//     uploadedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     rating: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         rating: Number,
//       },
//       ],
//       averageRating: { type: Number, default: 0 },
//       countRating: { type: Number, default: 0 },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Book", bookSchema);










const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    techStack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechStack",
      required: true,
    },
    techStacksubcategory: {
      type: String,
      required: true, // e.g., "React.js"
    },
    level:{
      type:String, // (Beginner, Intermediate, Advanced)
    },
    description: { type: String, maxlength: 2000 },
    coverImage: { type: String },
    fileUrl: { type: String, required: true },
    language: { type: String, default: "English" },
    tags: [{ type: String }],
    viewsCount:Number,
    downloadsCount:Number,
    totalChapters: { type: Number, default: 0 },
    aiSummary: { type: String },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: Number,
        comments:String
      },
    ],
    averageRating: { type: Number, default: 0 },
    countRating: { type: Number, default: 0 },
    totalComment:{ type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);

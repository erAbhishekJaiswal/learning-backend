const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    techStack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechStack",
    },
    techStacksubcategory: { type: String },
    level: { type: String }, // Beginner / Intermediate / Advanced
    description: { type: String, maxlength: 2000 },
    coverImage: { type: String },

    filePublicId: { type: String, required: true },
    language: { type: String, default: "English" },
    tags: [{ type: String }],

    viewsCount: { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },

    totalChapters: { type: Number, default: 0 },
    aiSummary: { type: String },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comments: String,
      },
    ],

    averageRating: { type: Number, default: 0 },
    countRating: { type: Number, default: 0 },
    totalComment: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

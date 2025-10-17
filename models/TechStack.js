const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "HTML", "React.js"
  description: { type: String },
});

const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Web Development"
  icon:{ type:String},
  description: { type: String },
  subcategories: [subCategorySchema], // Embedded subcategories
  popularityScore:Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TechStack", techStackSchema);

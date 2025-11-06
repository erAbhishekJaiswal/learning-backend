const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  about: { type: String },
  mission: { type: String },
  foundedYear: { type: Number },
  industry: { type: String },
  companySize: { type: String }, // e.g., "501-1000 employees"
  headquarters: { type: String },
  culture: [{ type: String }], // e.g., ["Innovation-driven", "Remote-first"]
  benefitsAndPerks: [{ type: String }], // e.g., ["Health insurance", "Stock options"]
  logoUrl: { type: String }, // optional
  website: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);

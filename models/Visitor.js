const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  date: { type: String, required: true },
  visitors: { type: Number, default: 0 },
  visitorIPs: [String],
  // Add any other fields you want to track with out ip addresses
  withoutIP: { type: Number, default: 0 },
});

// 🔥 FIX: USE COMMONJS EXPORT
module.exports = mongoose.model("Visitor", visitorSchema);

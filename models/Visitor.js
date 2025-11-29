const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  date: { type: String, required: true },
  visitors: { type: Number, default: 0 },
  visitorIPs: [String],
});

// 🔥 FIX: USE COMMONJS EXPORT
module.exports = mongoose.model("Visitor", visitorSchema);

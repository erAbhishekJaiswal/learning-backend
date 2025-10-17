const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String, // e.g. "Created Course", "Attempted Test"
  targetId: String,
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  metadata: String,
  targetType: String
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);

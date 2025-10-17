const mongoose = require("mongoose");

const aiInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  query: String,
  response: String,
  responseTokens:String,
  context:String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AIInteraction", aiInteractionSchema);

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  paymentType: { type: String, enum: ["Subscription", "Certification", "Course"], default: "Course" },
  transactionId: String,
  currency:{ type:String, default: 'INR'},
  paymentGateway:{type:String},
  status: { type: String, enum: ["Success", "Pending", "Failed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);

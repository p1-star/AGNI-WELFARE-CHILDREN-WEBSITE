const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  userId: String,                 // LINKED TO LOGGED-IN USER
  name: String,
  email: String,
  phone: String,
  amount: Number,
  razorpay_payment_id: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Donation", DonationSchema);

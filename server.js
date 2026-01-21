// ================= IMPORTS =================
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./User");
const Donation = require("./Donation");

// ================= APP =================
const app = express();
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
mongoose.connect("mongodb+srv://kuteparth730_db_user:vXdVDe3l664WaVCU@cluster0.brsctwc.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ================= RAZORPAY =================
const razorpay = new Razorpay({
  key_id: "rzp_test_S6UUJQGA7jipYs",
  key_secret: "l8n0vOsxIP7TUrHQqqeS2V7F"
});

// ================= AUTH APIs =================

// REGISTER
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ success: true, user });
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid login" });
  }

  res.json({ success: true, user });
});

// ================= PAYMENT =================

// CREATE ORDER
app.post("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// SAVE DONATION
app.post("/save-donation", async (req, res) => {
  const donation = new Donation(req.body);
  await donation.save();
  res.json({ success: true });
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

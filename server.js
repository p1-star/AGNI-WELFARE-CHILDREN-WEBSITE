// ================= IMPORTS =================
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./User");
const Donation = require("./Donation");

// ================= APP =================
const app = express();
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ================= RAZORPAY =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ================= AUTH APIs =================

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// ================= PAYMENT =================

// ================= CREATE ORDER =================
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed"
    });
  }
});

// ================= SAVE DONATION =================
app.post("/save-donation", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();

    res.json({
      success: true,
      message: "Donation saved successfully"
    });
  } catch (err) {
    console.error("Donation save error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save donation"
    });
  }
});

// ================= HEALTH CHECK (OPTIONAL) =================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const NCCApplication = require("./NCCApplication");

app.post("/api/ncc-application", async (req, res) => {
  try {
    const application = new NCCApplication(req.body);
    await application.save();

    res.json({
      success: true,
      applicationId: application._id
    });
  } catch (err) {
    console.error("NCC save error:", err);
    res.status(500).json({ success: false, message: "Failed to submit application" });
  }
});

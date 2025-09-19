const express = require("express");
const JWT = require("jsonwebtoken");
const User = require("../models/Users");
const router = express.Router();

// REGISTRATION
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User Already Exists" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({ msg: "User Registered Successfully!" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate token
    const token = JWT.sign(
      { id: user._id },
      process.env.JWT_SECRET , 
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, class: studentClass } = req.body;
    if (!name || !email || !password || !studentClass) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, class: studentClass });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to GyaanSetu',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        preferredLanguage: user.preferredLanguage,
        totalPoints: user.totalPoints,
        badge: user.badge
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        preferredLanguage: user.preferredLanguage,
        totalPoints: user.totalPoints,
        badge: user.badge
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route PUT /api/auth/updateLanguage
router.put('/language', protect, async (req, res) => {
  try {
    const { language } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferredLanguage: language },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

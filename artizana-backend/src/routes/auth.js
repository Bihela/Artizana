// src/routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { initCasbin } = require('../config/casbin');
const router = express.Router();

// Register Handler — Used in route AND exported for unit testing
const registerHandler = async (req, res) => {
  console.log('Incoming request:', req.body, req.ip, req.headers.origin);
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!['Buyer', 'Artisan', 'NGO/Edu Partner', 'Admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email already exists' });

    user = new User({ name, email, password, role });
    await user.save();

    const enforcer = await initCasbin();
    const canRegister = await enforcer.enforce(role, '/register', 'create');
    if (!canRegister) return res.status(403).json({ error: 'Role registration denied' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'Registration successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * KAN-5: Login Handler — email/password auth for existing users
 * Reuses the same User model, bcrypt hashing, and JWT strategy.
 * Exported for unit tests just like registerHandler.
 */
const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Do not reveal whether email or password is wrong
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password using model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT consistent with registerHandler
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token + basic user info (useful for frontend role-based redirect)
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Attach to routes
router.post('/register', registerHandler);

// KAN-5 route for existing user login
router.post('/login', loginHandler);

// EXPORT BOTH — Frontend uses /api/auth/* → Tests can import handlers directly
module.exports = { router, registerHandler, loginHandler };

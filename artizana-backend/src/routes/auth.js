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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Registration successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Attach to route
router.post('/register', registerHandler);

// EXPORT BOTH — Frontend uses /api/auth/register → Tests use registerHandler
module.exports = { router, registerHandler };
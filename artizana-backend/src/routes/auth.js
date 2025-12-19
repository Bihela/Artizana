const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const multer = require('multer');
const { uploadFileToFirebase } = require('../utils/uploadToFirebase');

const upload = multer({ storage: multer.memoryStorage() });

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ===== STANDARD AUTH =====

/**
 * Register Handler
 * Exported for unit tests
 */
const registerHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login Handler — email/password auth for existing users
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
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
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
      { id: user._id, email: user.email, role: user.role },
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
        bio: user.bio,
        location: user.location,
        phoneNumber: user.phoneNumber,
        shippingAddress: user.shippingAddress,
        profilePhoto: user.profilePhoto
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ===== WEB GOOGLE OAUTH =====
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    let target = `${FRONTEND_URL}/complete-profile?token=${token}`;

    if (req.user.role) {
      let isComplete = false;
      if (req.user.role === 'Buyer') {
        if (req.user.phoneNumber && req.user.shippingAddress) isComplete = true;
      } else if (req.user.role === 'Artisan') {
        if (req.user.bio && req.user.location) isComplete = true;
      } else if (req.user.role === 'NGO/Edu Partner') {
        isComplete = true; // Assuming no extra mandatory fields for now
      } else if (req.user.role === 'Admin') {
        isComplete = true;
      }

      if (isComplete) {
        if (req.user.role === 'Buyer') target = `${FRONTEND_URL}/buyer-dashboard?token=${token}`;
        else if (req.user.role === 'Artisan') target = `${FRONTEND_URL}/artisan-dashboard?token=${token}`;
        else if (req.user.role === 'NGO/Edu Partner') target = `${FRONTEND_URL}/ngo-dashboard?token=${token}`;
        else if (req.user.role === 'Admin') target = `${FRONTEND_URL}/admin-dashboard?token=${token}`;
      }
    }

    console.log('Redirecting Google user to:', target);
    res.redirect(target);
  }
);

// ===== UPDATE ROLE (For Google Auth First Time) =====
router.put('/update-role', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { role } = req.body;
    if (!['Buyer', 'Artisan', 'NGO/Edu Partner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    user.role = role;
    await user.save();

    // Return new token with updated role
    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// ===== GET CURRENT USER (ME) =====
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        phoneNumber: user.phoneNumber,
        shippingAddress: user.shippingAddress,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ===== UPDATE PROFILE =====
router.put('/update-profile', upload.single('profilePhoto'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, email, password, bio, location, phoneNumber, shippingAddress, role } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (email) {
      // Check uniqueness if email is changing
      if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });
        user.email = email;
      }
    }
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (role) {
      if (['Buyer', 'Artisan', 'NGO/Edu Partner'].includes(role)) {
        user.role = role;
      }
    }
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (shippingAddress) user.shippingAddress = shippingAddress;

    // Handle Profile Photo Upload
    if (req.file) {
      const downloadURL = await uploadFileToFirebase(req.file.buffer, req.file.originalname, 'profile-photos');
      user.profilePhoto = downloadURL;
    }

    await user.save();

    // Return new token
    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        phoneNumber: user.phoneNumber,
        shippingAddress: user.shippingAddress,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Attach to routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);

// EXPORT BOTH — Frontend uses /api/auth/* → Tests can import handlers directly
module.exports = { router, registerHandler, loginHandler };

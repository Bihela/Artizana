const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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

    const redirectTo = req.user.role
      ? `${FRONTEND_URL}/${req.user.role === 'Buyer' ? 'buyer-dashboard' : 'artisan-dashboard'}?token=${token}`
      : `${FRONTEND_URL}/complete-profile?token=${token}`;

    console.log('Redirecting Google user to:', redirectTo);
    res.redirect(redirectTo);
  }
);

  // ===== COMPLETE PROFILE (set role) =====
  router.post('/complete-profile', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (!token) return res.status(401).json({ error: 'No token provided' });

      let payload;
      try { payload = jwt.verify(token, process.env.JWT_SECRET); }
      catch (err) { return res.status(401).json({ error: 'Invalid token' }); }

      const user = await User.findById(payload.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const { role } = req.body;
      if (!role || !['Buyer', 'Artisan'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      user.role = role;
      await user.save();

      // Return refreshed token with updated role
      const newToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token: newToken });
    } catch (err) {
      console.error('Complete profile error:', err.message || err);
      res.status(500).json({ error: 'Failed to complete profile' });
    }
  });

// ===== MOBILE GOOGLE LOGIN =====
router.post('/google-mobile', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'No access token provided' });

    // Get user info from Google
    const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = googleRes.data;

    // Find or create user
    let user = await User.findOne({ googleId: profile.sub });
    if (!user) {
      user = await User.findOne({ email: profile.email });
      if (user) {
        user.googleId = profile.sub;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        googleId: profile.sub,
        name: profile.name,
        email: profile.email,
        role: null,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('Mobile Google login error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Google login failed' });
  }
});

module.exports = { router };
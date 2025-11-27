const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' // ensures Google login page appears every time
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect based on role
    const redirectTo = req.user.role
      ? `${FRONTEND_URL}/${req.user.role === 'Buyer' ? 'buyer-dashboard' : 'artisan-dashboard'}?token=${token}`
      : `${FRONTEND_URL}/complete-profile?token=${token}`;

    console.log('Redirecting Google user to:', redirectTo);
    res.redirect(redirectTo);
  }
);

module.exports = { router };
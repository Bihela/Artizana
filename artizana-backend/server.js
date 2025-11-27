// server.js
require('dotenv').config(); // ✅ MUST be first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');        // ← use express-session
const passport = require('./src/config/passport'); // passport config with Google OAuth

const app = express();

// Enhanced CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8081',
      'exp://*:*',
      'http://10.0.2.2:8081',
      'http://192.168.8.103:8081',
    ];
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // dev allow all
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Session & Passport Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// Logging
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  next();
});

// Security
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// JSON body parsing
app.use(express.json({ limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Routes
const { router: authRouter } = require('./src/routes/auth');
app.use('/api/auth', authRouter);

// Health check
app.get('/', (req, res) => res.json({ message: 'Artizana Backend Running' }));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
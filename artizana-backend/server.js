require('dotenv').config(); // MUST be first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./src/config/passport'); // Passport config with Google OAuth

const { router: authRouter } = require('./src/routes/auth');

const app = express();

// ===== CORS =====
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000', // web frontend
      'http://localhost:8081', // Expo dev server
      'exp://*:*',             // Expo QR tunnel
      'http://10.0.2.2:8081', // Android emulator
      'http://192.168.*.*',    // Local network
    ];
    if (!origin || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // allow all in dev
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// ===== Security & Rate Limiting =====
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// ===== Body Parser =====
app.use(express.json({ limit: '10mb' }));

// ===== Session & Passport =====
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// ===== Logging =====
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  next();
});

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// ===== Routes =====
app.use('/api/auth', authRouter);
const ngoApplicationRoutes = require('./src/routes/ngoApplication');
app.use('/api/ngo-applications', ngoApplicationRoutes);

// ===== Health Check =====
app.get('/', (req, res) => res.json({ message: 'Artizana Backend Running' }));

// ===== Start Server =====
const PORT = process.env.PORT || 5001;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
>>>>>>> dev

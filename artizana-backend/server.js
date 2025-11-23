// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

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
      callback(null, true);  // Dev allow all
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path} from Origin: ${req.headers.origin} | IP: ${req.ip} | Body:`, req.body);
  next();
});

// Security
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB Atlas connection error:', err.message));

// IMPORT ROUTER CORRECTLY
const { router: authRouter } = require('./src/routes/auth');
app.use('/api/auth', authRouter);

// Health check
app.get('/', (req, res) => res.json({ message: 'Artizana Backend Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
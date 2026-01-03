import 'dotenv/config'; // MUST be first

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from './src/config/passport'; // Passport config with Google OAuth

import { router as authRouter } from './src/routes/auth';

const app = express();

// ===== CORS =====
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Incoming: ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  next();
});

// ===== MongoDB Connection =====
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err.message));

// ===== Routes =====
app.use('/api/auth', authRouter);
// Using import for routes requires them to be exported properly or valid CommonJS modules
import ngoApplicationRoutes from './src/routes/ngoApplication';
app.use('/api/ngo-applications', ngoApplicationRoutes);
import productRoutes from './src/routes/product';
app.use('/api/products', productRoutes);

// ===== Health Check =====
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Artizana Backend Running' });
});

const PORT = process.env.PORT || 5001;
// if (require.main === module) {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

export default app;
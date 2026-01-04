import express, { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User, { IUser } from '../models/User';
import multer from 'multer';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';
import firebaseAdmin from '../config/firebaseAdmin';

export const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const client = new OAuth2Client(); // Client ID will be verified during verifyIdToken call
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ===== FIREBASE CUSTOM TOKEN =====
router.get('/firebase-token', async (req: Request, res: Response): Promise<any> => {
  try {
    if (!firebaseAdmin) {
      return res.status(503).json({ error: 'Firebase Admin not configured' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    // Normalize id
    const userId = decoded.id || decoded._id;

    // Create Custom Token with user ID and claims
    const additionalClaims = {
      role: decoded.role
    };

    const customToken = await firebaseAdmin.auth().createCustomToken(userId, additionalClaims);
    res.json({ token: customToken });

  } catch (err) {
    console.error('Error generating Firebase token:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// ===== STANDARD AUTH =====

/**
 * Register Handler
 * Exported for unit tests
 */
export const registerHandler = async (req: Request, res: Response): Promise<any> => {
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
      process.env.JWT_SECRET as string,
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
 */
export const loginHandler = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
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
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Return token + basic user info
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
  (req: Request, res: Response) => {
    // req.user is populated by passport
    const user = req.user as IUser; // Type assertion

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    let target = `${FRONTEND_URL}/complete-profile?token=${token}`;

    if (user.role) {
      let isComplete = false;
      if (user.role === 'Buyer') {
        if (user.phoneNumber && user.shippingAddress) isComplete = true;
      } else if (user.role === 'Artisan') {
        if (user.bio && user.location) isComplete = true;
      } else if (user.role === 'NGO/Edu Partner') {
        isComplete = true;
      } else if (user.role === 'Admin') {
        isComplete = true;
      }

      if (isComplete) {
        if (user.role === 'Buyer') target = `${FRONTEND_URL}/buyer-dashboard?token=${token}`;
        else if (user.role === 'Artisan') target = `${FRONTEND_URL}/artisan-dashboard?token=${token}`;
        else if (user.role === 'NGO/Edu Partner') target = `${FRONTEND_URL}/ngo-dashboard?token=${token}`;
        else if (user.role === 'Admin') target = `${FRONTEND_URL}/admin-dashboard?token=${token}`;
      }
    }

    console.log('Redirecting Google user to:', target);
    res.redirect(target);
  }
);


// ===== GOOGLE AUTH (WEB POPUP) =====
/**
 * Verifies Google ID Token
 */
router.post('/google-web', async (req: Request, res: Response): Promise<any> => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'No token provided' });

    console.log('Received ID Token Length:', idToken.length);

    // Verify token using Google Auth Library
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      // audience: ...
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'Invalid token payload' });

    // Extract info
    const { sub, email, name, picture } = payload;

    if (!email) return res.status(400).json({ error: 'Invalid token: email missing' });

    let user = await User.findOne({ email });

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = sub;
        if (!user.profilePhoto && picture) user.profilePhoto = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId: sub,
        profilePhoto: picture,
        role: null
      });
    }

    // Generate our JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (err: any) {
    console.error('Google Web Auth Error:', err.message);
    console.error('Full Error:', err);
    res.status(401).json({ error: 'Invalid Google token or auth failed' });
  }
});


// ===== UPDATE ROLE (For Google Auth First Time) =====
router.put('/update-role', async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
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
      process.env.JWT_SECRET as string,
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

/**
 * Get Profile Handler
 */
export const getProfileHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
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
        profilePhoto: user.profilePhoto,
        // Placeholder for activity
        recentActivity: [],
      }
    });
  } catch (err) {
    console.error('Get Profile error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/me', getProfileHandler);

// ===== UPDATE PROFILE =====
router.put('/update-profile', upload.single('profilePhoto'), async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
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
      process.env.JWT_SECRET as string,
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


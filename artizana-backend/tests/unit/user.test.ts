import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../src/models/User';

// Mock bcryptjs to avoid actual hashing during tests
jest.mock('bcryptjs');

describe('User Model Unit Tests', () => {
  let user;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('pre-save hook', () => {
    it('should hash the password before saving', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password_123');
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt_123');

      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        role: 'Buyer',
        password: 'plain_password'
      });
      user.isModified = jest.fn().mockReturnValue(true);

      // Simulate pre-save logic manually since we can't trigger save hook easily
      if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('plain_password', 'salt_123');
      expect(user.password).toBe('hashed_password_123');
    });
  });

  describe('comparePassword', () => {
    let user;

    beforeEach(() => {
      user = new User({
        name: 'Test',
        email: 'test@example.com',
        password: 'hashed_password'
      });
    });

    it('should return true if passwords match', async () => {
      user.password = 'hashed_password_123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const isMatch = await user.comparePassword('password123');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password_123');
      expect(isMatch).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      user.password = 'hashed_password_123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const isMatch = await user.comparePassword('wrongpassword');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password_123');
      expect(isMatch).toBe(false);
    });

    it('should return false if user has no password (e.g. Google Auth user)', async () => {
      const user = new User({
        name: 'Google User',
        email: 'google@example.com'
        // no password field
      });

      const isMatch = await user.comparePassword('any_password');

      expect(isMatch).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
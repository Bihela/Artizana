// tests/unit/auth.test.ts
import { registerHandler, loginHandler, getProfileHandler } from '../../src/routes/auth';
// @ts-ignore
import User from '../../src/models/User';
import jwt from 'jsonwebtoken';
import { initCasbin } from '../../src/config/casbin';

jest.mock('../../src/models/User');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/casbin');

describe('Auth Controller - Unit - Register', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { name: 'Test', email: 'test@example.com', password: 'password123', role: 'Buyer' },
      ip: '127.0.0.1',
      headers: { origin: 'http://localhost:3000' }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({
      _id: 'mockId',
      name: 'Test',
      email: 'test@example.com',
      role: 'Buyer',
      save: jest.fn()
    });
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
    (initCasbin as jest.Mock).mockResolvedValue({
      enforce: jest.fn().mockResolvedValue(true)
    });
  });

  test('registers a new user successfully', async () => {
    await registerHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token: 'mock-token',
      user: {
        id: 'mockId',
        name: 'Test',
        email: 'test@example.com',
        role: 'Buyer'
      }
    });
  });
});

describe('Auth Controller - Unit - Login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: 'login@example.com', password: 'password123' }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // For login we want findOne to return an object with a select method
    // For login we want findOne to return an object with a select method
    // to support the chaining: User.findOne(...).select('+password')
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'mockId',
        name: 'Login User',
        email: 'login@example.com',
        role: 'Buyer',
        comparePassword: jest.fn().mockResolvedValue(true),
      })
    });

    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
  });

  test('logs in an existing user successfully', async () => {
    await loginHandler(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'login@example.com' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'mock-token',
      user: {
        id: 'mockId',
        name: 'Login User',
        email: 'login@example.com',
        role: 'Buyer',
        profilePhoto: undefined, // undefined because mock didn't have it, but consistent with structure
      },
    });
  });
});

describe('Auth Controller - Unit - Get Profile', () => {
  let req, res;

  beforeEach(() => {
    req = {
      headers: { authorization: 'Bearer mock-token' }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    (jwt.verify as jest.Mock).mockReturnValue({ id: 'mockId' });
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'mockId',
      name: 'Profile User',
      email: 'profile@example.com',
      role: 'Buyer',
      profilePhoto: 'http://example.com/photo.jpg'
    });
  });

  it('should get profile successfully', async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'user123',
      name: 'Test',
      email: 'test@example.com',
      role: 'Buyer'
    });

    await getProfileHandler(req, res);

    expect(User.findById).toHaveBeenCalledWith('mockId'); // Matches jwt.verify mock
    // res.status(200) is implicit in res.json() for Express, but mock might not capture it if not explicitly called.
    // The handler doesn't call .status(200), so we remove this expectation.
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: {
        id: 'user123',
        name: 'Test',
        email: 'test@example.com',
        role: 'Buyer',
        recentActivity: [], // Added to match expected structure
        profilePhoto: undefined // Added to match expected structure
      }
    }));
  });

  it('should return 401 if no token provided', async () => {
    req.headers.authorization = undefined;
    await getProfileHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 404 if user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await getProfileHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
});

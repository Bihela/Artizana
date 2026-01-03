// tests/unit/auth.test.js
const { registerHandler, loginHandler, getProfileHandler } = require('../../src/routes/auth');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const { initCasbin } = require('../../src/config/casbin');

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

    User.findOne.mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue({
      _id: 'mockId',
      name: 'Test',
      email: 'test@example.com',
      role: 'Buyer'
    });
    jest.spyOn(User.prototype, 'save').mockResolvedValue({ _id: 'mockId', role: 'Buyer' });
    jwt.sign.mockReturnValue('mock-token');
    initCasbin.mockResolvedValue({
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
    // to support the chaining: User.findOne(...).select('+password')
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'mockId',
        name: 'Login User',
        email: 'login@example.com',
        role: 'Buyer',
        comparePassword: jest.fn().mockResolvedValue(true),
      })
    });

    jwt.sign.mockReturnValue('mock-token');
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

    jwt.verify.mockReturnValue({ id: 'mockId' });
    User.findById.mockResolvedValue({
      _id: 'mockId',
      name: 'Profile User',
      email: 'profile@example.com',
      role: 'Buyer',
      profilePhoto: 'http://example.com/photo.jpg'
    });
  });

  test('returns user profile successfully', async () => {
    await getProfileHandler(req, res);

    expect(User.findById).toHaveBeenCalledWith('mockId');
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'mockId',
        name: 'Profile User',
        email: 'profile@example.com',
        role: 'Buyer',
        profilePhoto: 'http://example.com/photo.jpg',
        recentActivity: [],
      }
    });
  });

  test('returns 401 if no token provided', async () => {
    req.headers.authorization = undefined;
    await getProfileHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  test('returns 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);
    await getProfileHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
});

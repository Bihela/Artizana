// tests/unit/auth.test.js
const { registerHandler, loginHandler } = require('../../src/routes/auth');
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

    // For login we want findOne to return a user with comparePassword method
    User.findOne.mockResolvedValue({
      _id: 'mockId',
      name: 'Login User',
      email: 'login@example.com',
      role: 'Buyer',
      comparePassword: jest.fn().mockResolvedValue(true),
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
      },
    });
  });
});

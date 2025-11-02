// tests/unit/auth.test.js
const { registerHandler } = require('../../src/routes/auth');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const { initCasbin } = require('../../src/config/casbin');

jest.mock('../../src/models/User');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/casbin');

describe('Auth Controller - Unit', () => {
  let req, res;

  beforeEach(() => {
    req = { 
      body: { name: 'Test', email: 'test@example.com', password: 'password123', role: 'Buyer' },
      ip: '127.0.0.1',
      headers: { origin: 'http://localhost:3000' }  
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({ _id: 'mockId', role: 'Buyer' });
    jwt.sign.mockReturnValue('mock-token');
    initCasbin.mockResolvedValue({
      enforce: jest.fn().mockResolvedValue(true)
    });
  });

  test('registers a new user successfully', async () => {
    await registerHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Registration successful',
      token: 'mock-token'
    });
  });
});
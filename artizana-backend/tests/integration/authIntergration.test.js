// tests/integration/authIntegration.test.js
const request = require('supertest');
const express = require('express');
const { router } = require('../../src/routes/auth');

// MOCK USER MODEL — FULLY
const mockUser = {
  save: jest.fn().mockResolvedValue({ _id: 'mockId', role: 'Buyer' })
};

jest.mock('../../src/models/User', () => {
  const mockFindOne = jest.fn();
  const User = jest.fn().mockImplementation(() => mockUser);
  User.findOne = mockFindOne;
  return User;
});

// AFTER mock is defined, set findOne to return null
require('../../src/models/User').findOne.mockResolvedValue(null);

// MOCK CASBIN
jest.mock('../../src/config/casbin', () => ({
  initCasbin: jest.fn().mockResolvedValue({
    enforce: jest.fn().mockResolvedValue(true)
  })
}));

// MOCK JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token')
}));

process.env.JWT_SECRET = 'test-secret';

const app = express();
app.use(express.json());
app.use('/api/auth', router);

describe('Auth Integration', () => {
  test('POST /api/auth/register creates user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Buyer'
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Registration successful',
      token: 'mock-jwt-token'
    });
  }, 10000);
});
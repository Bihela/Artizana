// tests/integration/authIntegration.test.js
import request from 'supertest';
import express from 'express';
// @ts-ignore
// @ts-ignore
import { router } from '../../src/routes/auth';
// import { User as UserType } from '../../src/models/User';

// MOCK USER MODEL — FULLY
const mockUser = {
  save: jest.fn().mockResolvedValue({ _id: 'mockId', role: 'Buyer' })
};

jest.mock('../../src/models/User', () => {
  const mockFindOne = jest.fn();
  const User = jest.fn().mockImplementation(() => mockUser);
  // @ts-ignore
  User.findOne = mockFindOne;
  // @ts-ignore
  User.findById = jest.fn(); // Added findById support
  // @ts-ignore
  User.create = jest.fn().mockResolvedValue({
    _id: 'mockId',
    name: 'Test User',
    email: 'test@example.com',
    role: 'Buyer'
  });
  return User;
});

// AFTER mock is defined, set findOne to return null BY DEFAULT
// @ts-ignore
import UserModel from '../../src/models/User';
// @ts-ignore
(UserModel.findOne as jest.Mock).mockResolvedValue(null);

// MOCK CASBIN
jest.mock('../../src/config/casbin', () => ({
  initCasbin: jest.fn().mockResolvedValue({
    enforce: jest.fn().mockResolvedValue(true)
  })
}));

// MOCK JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ id: 'mockId' }) // Added verify mock
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
      token: 'mock-jwt-token',
      user: {
        id: 'mockId',
        name: 'Test User',
        email: 'test@example.com',
        role: 'Buyer'
      }
    });
  }, 10000);

  // KAN-5: login integration test
  test('POST /api/auth/login authenticates user', async () => {
    // For this test, we want findOne to return a real-ish user object
    // support chaining .select('+password')
    (UserModel.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'mockId',
        name: 'Login User',
        email: 'login@example.com',
        role: 'Buyer',
        comparePassword: jest.fn().mockResolvedValue(true), // password matches
      })
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: 'mockId',
        name: 'Login User',
        email: 'login@example.com',
        role: 'Buyer',
        profilePhoto: undefined, // undefined in mock
      },
    });
  }, 10000);

  test('GET /api/auth/me returns profile', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue({
      _id: 'mockId',
      name: 'Profile User',
      email: 'profile@example.com',
      role: 'Buyer',
      profilePhoto: 'http://example.com/photo.jpg'
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer mock-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        id: 'mockId',
        name: 'Profile User',
        email: 'profile@example.com',
        role: 'Buyer',
        profilePhoto: 'http://example.com/photo.jpg',
        recentActivity: [],
      }
    });
  }, 10000);
});

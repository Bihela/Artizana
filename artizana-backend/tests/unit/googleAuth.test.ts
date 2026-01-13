import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
// @ts-ignore
import User from '../../src/models/User';

// Mock google-auth-library
const mockVerifyIdToken = jest.fn();
jest.mock('google-auth-library', () => {
    return {
        OAuth2Client: jest.fn().mockImplementation(() => {
            return {
                verifyIdToken: mockVerifyIdToken
            };
        })
    };
});

// Import the router AFTER mocking
const { router } = require('../../src/routes/auth');

describe('POST /google-web', () => {
    let app;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test_secret';
        app = express();
        app.use(bodyParser.json());
        app.use('/', router);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if no token provided', async () => {
        const res = await request(app).post('/google-web').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('No token provided');
    });

    it('should create a new user and return token when valid google token provided', async () => {
        // Mock Google Response
        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                sub: 'google_123',
                email: 'newuser@example.com',
                name: 'New Google User',
                picture: 'http://pic.com/1'
            })
        });

        // Mock User.findOne to return null (user not found)
        jest.spyOn(User, 'findOne').mockResolvedValue(null);

        // Mock User.create to return a new user
        const mockUser = {
            _id: 'user_123',
            name: 'New Google User',
            email: 'newuser@example.com',
            role: null,
            googleId: 'google_123',
            profilePhoto: 'http://pic.com/1'
        };
        jest.spyOn(User, 'create').mockResolvedValue(mockUser as any);

        const res = await request(app).post('/google-web').send({ idToken: 'valid_token' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('newuser@example.com');
        expect(res.body.user.role).toBeNull();
    });

    it('should login existing user and return token', async () => {
        // Mock Google Response
        mockVerifyIdToken.mockResolvedValue({
            getPayload: () => ({
                sub: 'google_456',
                email: 'existing@example.com',
                name: 'Existing User',
                picture: 'http://pic.com/2'
            })
        });

        // Mock User.findOne to return existing user
        const mockExistingUser = {
            _id: 'user_456',
            name: 'Existing User',
            email: 'existing@example.com',
            role: 'Buyer',
            googleId: 'google_456',
            profilePhoto: 'http://pic.com/2',
            save: jest.fn().mockResolvedValue(true)
        };
        jest.spyOn(User, 'findOne').mockResolvedValue(mockExistingUser);

        const res = await request(app).post('/google-web').send({ idToken: 'valid_token_existing' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('existing@example.com');
        expect(res.body.user.role).toBe('Buyer');
    });
});

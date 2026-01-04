import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
// @ts-ignore
import User from '../../src/models/User';

// Mock middlewares or external services if needed
// But for integration, we usually want to test the full stack except external I/O (DB)

// MOCK User model methods to avoid DB hits
jest.mock('../../src/models/User');

// We need to require app AFTER mocking
// Import app using require and accessing .default because of export default in TS
const app = require('../../server').default;

describe('Profile Integration Tests', () => {
    let token;
    let mockUser;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock user
        mockUser = {
            _id: 'mock-user-id',
            name: 'Test User',
            email: 'test@example.com',
            role: 'Buyer',
            save: jest.fn().mockResolvedValue(true),
        };

        // Mock FindById
        (User.findById as jest.Mock).mockResolvedValue(mockUser);

        // Generate a valid JWT for the mock user
        token = jwt.sign(
            { id: mockUser._id, email: mockUser.email, role: mockUser.role },
            process.env.JWT_SECRET || 'test_secret', // server.js might fail if JWT_SECRET not set, ensure setup.js handles it or env
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => {
        // Close server connection if it opens one
        await mongoose.connection.close();
    });

    test('PUT /api/auth/update-profile should update buyer fields', async () => {
        // Mock User.findById to return our user (already done in beforeEach)

        // We also need to mock User.findOne for email uniqueness check if email is updated
        // But here we are just updating profile fields

        const updateData = {
            role: 'Buyer',
            phoneNumber: '1234567890',
            shippingAddress: '123 Test St'
        };

        const res = await request(app)
            .put('/api/auth/update-profile')
            .set('Authorization', `Bearer ${token}`)
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined(); // Should return a new token
        expect(res.body.user.phoneNumber).toEqual('1234567890');

        // Verify user.save was called
        expect(mockUser.save).toHaveBeenCalled();

        // Verify fields were updated on the user object
        expect(mockUser.phoneNumber).toEqual('1234567890');
        expect(mockUser.shippingAddress).toEqual('123 Test St');
    });

    test('PUT /api/auth/update-profile should update artisan fields', async () => {
        // Change mock user role to Artisan for this test
        mockUser.role = 'Artisan';

        // Re-sign token for Artisan
        const artisanToken = jwt.sign(
            { id: mockUser._id, email: mockUser.email, role: 'Artisan' },
            process.env.JWT_SECRET || 'test_secret',
            { expiresIn: '1h' }
        );

        const updateData = {
            role: 'Artisan',
            bio: 'I make cool stuff',
            location: 'Colombo'
        };

        const res = await request(app)
            .put('/api/auth/update-profile')
            .set('Authorization', `Bearer ${artisanToken}`)
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        expect(mockUser.bio).toEqual('I make cool stuff');
        expect(mockUser.location).toEqual('Colombo');
        expect(mockUser.save).toHaveBeenCalled();
    });

    test('PUT /api/auth/update-profile should fail without token', async () => {
        const res = await request(app)
            .put('/api/auth/update-profile')
            .send({});

        expect(res.statusCode).toEqual(401);
    });
});

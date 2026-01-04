process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'mock_client_id';
process.env.GOOGLE_CLIENT_SECRET = 'mock_client_secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:3000/auth/google/callback';
process.env.MONGO_URI = 'mongodb://localhost:27017/artizana_test';

import mongoose from 'mongoose';

// Mock Mongoose connection globally for all tests
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        connect: jest.fn().mockResolvedValue(actualMongoose),
        connection: {
            ...actualMongoose.connection,
            close: jest.fn().mockResolvedValue(true),
        },
    };
});

// Provide a stable JWT_SECRET for tests
process.env.JWT_SECRET = 'test_jwt_secret_123';

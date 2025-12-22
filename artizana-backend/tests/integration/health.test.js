const request = require('supertest');
const app = require('../../server');
const mongoose = require('mongoose');

describe('Health Check Integration', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('GET / should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Artizana Backend Running');
    });
});

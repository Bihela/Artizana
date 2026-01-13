import request from 'supertest';
// @ts-ignore
import app from '../../server';
import mongoose from 'mongoose';

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

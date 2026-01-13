import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import productRoutes from '../../src/routes/product';
import Product from '../../src/models/Product';
import User from '../../src/models/User';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// Mock Auth Middleware if needed, but getProduct is public
jest.mock('../../src/middleware/auth', () => (req: any, res: any, next: any) => {
    req.user = { id: 'mockuser', role: 'Artisan' };
    next();
});

describe('GET /api/products/:id', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Product.deleteMany({});
        await User.deleteMany({});
    });

    it('should return 404 if product not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/products/${nonExistentId}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Product not found');
    });

    it('should return product details for valid ID', async () => {
        // Create Artisan
        const artisan = await User.create({
            name: 'Test Artisan',
            email: 'artisan@test.com',
            password: 'password123',
            role: 'Artisan'
        });

        // Create Product
        const product = await Product.create({
            title: 'Test Product',
            description: 'Test Description',
            price: 100,
            category: 'Crafts',
            quantity: 10,
            artisan: artisan._id
        });

        const res = await request(app).get(`/api/products/${product._id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Test Product');
        expect(res.body.artisan.name).toBe('Test Artisan');
        expect(res.body).toHaveProperty('feedback'); // Check for placeholder
    });
});

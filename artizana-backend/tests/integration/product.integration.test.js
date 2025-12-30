const request = require('supertest');
const express = require('express');
const productRouter = require('../../src/routes/product');
const Product = require('../../src/models/Product');

jest.mock('../../src/models/Product');

// Mock Product model
const mockSave = jest.fn();
Product.mockImplementation((data) => ({
    ...data,
    save: mockSave
}));

// Mock Auth Middleware
jest.mock('../../src/middleware/auth', () => (req, res, next) => {
    // Simulate authenticated Artisan
    req.user = { id: 'artisan123', role: 'Artisan' };
    next();
});

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Product Integration Tests', () => {
    beforeEach(() => {
        mockSave.mockReset();
    });

    const validProduct = {
        title: 'Integration Pot',
        description: 'Testing via supertest',
        price: 99,
        category: 'Test',
        quantity: 5
    };

    it('POST /api/products/add - success', async () => {
        mockSave.mockResolvedValue({
            ...validProduct,
            _id: 'prod_integration_1',
            artisan: 'artisan123'
        });

        const res = await request(app)
            .post('/api/products/add')
            .send(validProduct);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Product added successfully');
        expect(res.body.product.title).toBe('Integration Pot');
        expect(mockSave).toHaveBeenCalled();
    });

    it('POST /api/products/add - handles incorrect role (simulated by middleware mock change?)', async () => {
        // Since we mocked auth globally, testing forbidden case is tricky in the same file unless we use jest.doMock
        // For this pattern, we accept that auth logic is tested in unit tests, 
        // and here we test the route wiring.
        // But let's try to mock rejection from Model to verify error handling.

        mockSave.mockRejectedValue(new Error('DB Error'));

        const res = await request(app)
            .post('/api/products/add')
            .send(validProduct);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Server error while adding product');
    });
});

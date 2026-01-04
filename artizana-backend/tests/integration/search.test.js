const request = require('supertest');
const app = require('../../server');
const Product = require('../../src/models/Product');

// Mock Product model
jest.mock('../../src/models/Product');

// Mock Auth middleware to bypass authentication if needed (though search is public)
jest.mock('../../src/middleware/auth', () => (req, res, next) => next());

describe('GET /api/products/search', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should search products by keyword and return mock results', async () => {
        // Mock db response
        const mockProducts = [
            {
                title: 'Handmade Pottery Vase',
                description: 'Beautiful ceramic vase',
                price: 50,
                category: 'Pottery',
                toObject: () => ({
                    title: 'Handmade Pottery Vase',
                    price: 50
                })
            }
        ];

        // Chain mocks: Product.find().populate().sort()
        const mockSort = jest.fn().mockResolvedValue(mockProducts);
        const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
        Product.find.mockReturnValue({ populate: mockPopulate });

        const res = await request(app).get('/api/products/search?q=Vase');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Handmade Pottery Vase');
        expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({
            $or: [
                { title: { $regex: 'Vase', $options: 'i' } },
                { description: { $regex: 'Vase', $options: 'i' } }
            ]
        }));
    });

    it('should filter by category and price', async () => {
        const mockSort = jest.fn().mockResolvedValue([]);
        const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
        Product.find.mockReturnValue({ populate: mockPopulate });

        await request(app).get('/api/products/search?category=Pottery&minPrice=10');

        expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({
            category: 'Pottery',
            price: { $gte: 10 }
        }));
    });

    it('should include feedback placeholder in response', async () => {
        const mockProducts = [{
            title: 'Test Item',
            toObject: () => ({ title: 'Test Item' })
        }];

        const mockSort = jest.fn().mockResolvedValue(mockProducts);
        const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
        Product.find.mockReturnValue({ populate: mockPopulate });

        const res = await request(app).get('/api/products/search');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('feedback');
        expect(res.body[0].feedback).toEqual({
            averageRating: null,
            reviewCount: 0,
            reviews: []
        });
    });

    it('should handle errors gracefully', async () => {
        Product.find.mockImplementation(() => {
            throw new Error('Database Error');
        });

        const res = await request(app).get('/api/products/search');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'Server error during search' });
    });
});

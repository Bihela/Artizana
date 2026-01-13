import * as productController from '../../src/controllers/addProduct';
// @ts-ignore
import Product from '../../src/models/Product';

jest.mock('../../src/models/Product');

let req, res, next;

beforeEach(() => {
    req = {
        body: {},
        user: { _id: 'artisan123', role: 'Artisan' }
    };
    res = {
        statusCode: 200,
        data: null,
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            this.data = data;
            return this;
        }
    };
    next = jest.fn();
});

describe('Product Controller - Add Product', () => {

    it('should return 201 and created product when data is valid and user is Artisan', async () => {
        req.body = {
            title: 'Handmade Pot',
            description: 'A beautiful clay pot',
            price: 50,
            category: 'Pottery',
            quantity: 10
        };

        const mockProductInstance = {
            ...req.body,
            _id: 'prod123',
            artisan: 'artisan123',
            save: jest.fn().mockResolvedValue({
                ...req.body,
                _id: 'prod123',
                artisan: 'artisan123'
            })
        };

        (Product as any).mockImplementation((data: any) => ({
            ...data,
            save: mockProductInstance.save
        }));

        await productController.addProduct(req as any, res as any);

        expect(res.statusCode).toBe(201);
        expect(res.data.message).toBe('Product added successfully');
        expect(res.data.product.title).toBe('Handmade Pot');
        expect(Product).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Handmade Pot',
            artisan: 'artisan123'
        }));
    });

    it('should return 401 if user is not authenticated', async () => {
        req.user = undefined;
        await productController.addProduct(req as any, res as any);
        expect(res.statusCode).toBe(401);
        expect(res.data.message).toMatch(/Unauthorized/);
    });

    it('should return 403 if user is not an Artisan', async () => {
        req.user = { id: 'buyer123', role: 'Buyer' };
        await productController.addProduct(req as any, res as any);
        expect(res.statusCode).toBe(403);
        expect(res.data.message).toMatch(/Access denied/);
    });

    it('should return 500 when save fails', async () => {
        req.body = { title: 'Bad Product' };
        const mockError = new Error('Database connection failed');

        (Product as any).mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(mockError)
        }));

        await productController.addProduct(req as any, res as any);

        expect(res.statusCode).toBe(500);
        expect(res.data.message).toBe('Server error while adding product');
    });
});

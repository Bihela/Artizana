const authMiddleware = require('../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const { initCasbin } = require('../../src/config/casbin');

jest.mock('jsonwebtoken');
jest.mock('../../src/config/casbin');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            header: jest.fn(),
            path: '/api/some/route',
            originalUrl: '/api/some/route',
            ip: '127.0.0.1'
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
        process.env.JWT_SECRET = 'secret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', async () => {
        req.header.mockReturnValue(null);
        await authMiddleware(req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res.data).toEqual({ error: 'No token provided' });
    });

    it('should return 401 if token is invalid', async () => {
        req.header.mockReturnValue('Bearer invalidtoken');
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authMiddleware(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.data).toEqual({ error: 'Invalid token' });
    });

    it('should bypass Casbin check for Artisan on /api/products/add', async () => {
        req.header.mockReturnValue('Bearer validtoken');
        req.path = '/api/products/add';
        req.originalUrl = '/api/products/add';
        const user = { id: 'artisan1', role: 'Artisan' };
        jwt.verify.mockReturnValue(user);

        await authMiddleware(req, res, next);

        expect(req.user).toEqual(user);
        expect(initCasbin).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should enforce Casbin check for other routes', async () => {
        req.header.mockReturnValue('Bearer validtoken');
        req.path = '/api/other';
        req.originalUrl = '/api/other';
        const user = { id: 'user1', role: 'Buyer' };
        jwt.verify.mockReturnValue(user);

        const mockEnforcer = {
            enforce: jest.fn().mockResolvedValue(true)
        };
        initCasbin.mockResolvedValue(mockEnforcer);

        await authMiddleware(req, res, next);

        expect(initCasbin).toHaveBeenCalled();
        expect(mockEnforcer.enforce).toHaveBeenCalledWith('Buyer', '/api/other', 'read');
        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if Casbin denies access', async () => {
        req.header.mockReturnValue('Bearer validtoken');
        req.path = '/api/admin';
        req.originalUrl = '/api/admin';
        const user = { id: 'user1', role: 'Buyer' };
        jwt.verify.mockReturnValue(user);

        const mockEnforcer = {
            enforce: jest.fn().mockResolvedValue(false)
        };
        initCasbin.mockResolvedValue(mockEnforcer);

        await authMiddleware(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(res.data).toEqual({ error: 'Access denied for your role' });
    });
});

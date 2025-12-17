const authMiddleware = require('../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const { initCasbin } = require('../../src/config/casbin');

jest.mock('jsonwebtoken');
jest.mock('../../src/config/casbin');

describe('Auth Middleware - Logging', () => {
    let req, res, next;
    let consoleSpy;

    beforeEach(() => {
        req = {
            header: jest.fn(),
            ip: '127.0.0.1',
            path: '/api/protected',
            originalUrl: '/api/protected'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        jest.clearAllMocks();
    });

    test('logs warning when no token is provided', async () => {
        req.header.mockReturnValue(null); // No Authorization header

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[AUTH FAILURE] No token provided'));
    });

    test('logs warning when token is invalid', async () => {
        req.header.mockReturnValue('Bearer invalid-token');
        jwt.verify.mockImplementation(() => { throw new Error('jwt malformed'); });

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[AUTH FAILURE] Invalid token'));
    });

    test('logs warning when access is denied (RBAC)', async () => {
        req.header.mockReturnValue('Bearer valid-token');
        jwt.verify.mockReturnValue({ id: 'user1', email: 'user@example.com', role: 'Buyer' });

        initCasbin.mockResolvedValue({
            enforce: jest.fn().mockResolvedValue(false) // Deny access
        });

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Access denied for your role' });
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[AUTH FAILURE] Access denied (RBAC)'));
    });
});

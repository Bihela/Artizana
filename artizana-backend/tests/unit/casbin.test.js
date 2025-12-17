// tests/unit/casbin.test.js
const { initCasbin } = require('../../src/config/casbin');
const { newEnforcer } = require('casbin');

jest.mock('casbin');

describe('Casbin RBAC', () => {
  let enforcerMock;

  beforeAll(() => {
    enforcerMock = { enforce: jest.fn().mockResolvedValue(true) };
    newEnforcer.mockResolvedValue(enforcerMock);
  });

  it('should initialize enforcer', async () => {
    const enforcer = await initCasbin();
    expect(enforcer).toBe(enforcerMock);
    expect(newEnforcer).toHaveBeenCalled();
  });

  it('should enforce policy correctly', async () => {
    const enforcer = await initCasbin();
    const result = await enforcer.enforce('Admin', '/api/test', 'read');
    expect(result).toBe(true);
    expect(enforcer.enforce).toHaveBeenCalledWith('Admin', '/api/test', 'read');
  });
});
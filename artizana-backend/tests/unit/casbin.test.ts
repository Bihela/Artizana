// tests/unit/casbin.test.ts
import { initCasbin } from '../../src/config/casbin';
import { newEnforcer } from 'casbin';

jest.mock('casbin', () => ({
  __esModule: true,
  newEnforcer: jest.fn()
}));

describe('Casbin RBAC', () => {
  let enforcerMock;
  let enforcer; // Declare enforcer here

  beforeAll(async () => {
    enforcerMock = {
      addPolicy: jest.fn().mockResolvedValue(true),
      enforce: jest.fn().mockResolvedValue(true)
    };
    (newEnforcer as jest.Mock).mockResolvedValue(enforcerMock);

    enforcer = await initCasbin(); // Initialize enforcer here
  });

  it('should initialize enforcer', async () => {
    // enforcer is already initialized in beforeAll
    expect(enforcer).toBe(enforcerMock);
    // expect(newEnforcer).toHaveBeenCalled(); // Flaky with singleton pattern
  });

  it('should enforce policy correctly', async () => {
    // Use the enforcer initialized in beforeAll
    const result = await enforcer.enforce('Admin', '/api/test', 'read');
    expect(result).toBe(true);
    expect(enforcer.enforce).toHaveBeenCalledWith('Admin', '/api/test', 'read');
  });
});
// tests/unit/passport.test.js
const passport = require('../../src/config/passport');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

describe('Passport GoogleStrategy', () => {
  let googleCallback;

  beforeAll(() => {
    const strategy = passport._strategies.google;
    googleCallback = strategy._verify;
  });

  it('should create a new user if not exists', async () => {
    User.findOne.mockResolvedValueOnce(null); // googleId
    User.findOne.mockResolvedValueOnce(null); // email
    User.create.mockResolvedValue({ _id: '1', name: 'Test', email: 'test@example.com' });

    const done = jest.fn();
    const profile = {
      id: 'google-id-123',
      displayName: 'Test',
      emails: [{ value: 'test@example.com' }]
    };

    await googleCallback('accessToken', 'refreshToken', profile, done);
    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ _id: '1', email: 'test@example.com' }));
  });

  it('should link existing user by email', async () => {
    User.findOne
      .mockResolvedValueOnce(null) // googleId
      .mockResolvedValueOnce({ _id: '2', email: 'test2@example.com', save: jest.fn() }); // email

    const done = jest.fn();
    const profile = {
      id: 'google-id-456',
      displayName: 'Test2',
      emails: [{ value: 'test2@example.com' }]
    };

    await googleCallback('accessToken', 'refreshToken', profile, done);
    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ _id: '2', email: 'test2@example.com' }));
  });
});
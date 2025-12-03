// tests/unit/user.test.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB if needed
    await mongoose.connect('mongodb://127.0.0.1:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should hash password before save', async () => {
    const user = new User({ name: 'Test', email: 'test@example.com', password: '123456' });
    await user.save();
    expect(user.password).not.toBe('123456');
    const isMatch = await bcrypt.compare('123456', user.password);
    expect(isMatch).toBe(true);
  });

  it('comparePassword returns true for correct password', async () => {
    const user = new User({ name: 'Test2', email: 'test2@example.com', password: 'abc123' });
    await user.save();
    const result = await user.comparePassword('abc123');
    expect(result).toBe(true);
  });

  it('comparePassword returns false for incorrect password', async () => {
    const user = new User({ name: 'Test3', email: 'test3@example.com', password: 'abc123' });
    await user.save();
    const result = await user.comparePassword('wrong');
    expect(result).toBe(false);
  });
});
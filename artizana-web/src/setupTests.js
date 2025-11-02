// src/setupTests.js
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { token: 'mock-jwt' } })),
  create: () => ({
    post: jest.fn(() => Promise.resolve({ data: { token: 'mock-jwt' } }))
  })
}));
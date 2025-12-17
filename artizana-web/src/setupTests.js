// src/setupTests.js
import '@testing-library/jest-dom';

// THIS IS THE ONLY THING THAT MATTERS FOR THE LOGO TEST
let counter = 1;
global.URL.createObjectURL = jest.fn(() => `blob:http://localhost/${counter++}`);
global.URL.revokeObjectURL = jest.fn();

// YOUR ORIGINAL AXIOS MOCK — RESTORED EXACTLY
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { token: 'mock-jwt' } })),
  create: () => ({
    post: jest.fn(() => Promise.resolve({ data: { token: 'mock-jwt' } }))
  })
}));
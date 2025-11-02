// src/__tests__/integration/SignUpIntegration.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// MOCK react-router-dom BEFORE ANY IMPORT OF SignUp
const mockNavigate = jest.fn();
jest.doMock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// NOW import SignUp — AFTER mock
const SignUp = require('../../pages/SignUp').default;

jest.mock('axios');

describe('SignUp Integration', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } });
    jest.clearAllMocks();
  });

  test('navigates to buyer-dashboard on successful signup', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Buyer' } });
    fireEvent.click(screen.getByLabelText('I agree to the Terms & Conditions'));
    fireEvent.click(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/buyer-dashboard');
    });
  });
});
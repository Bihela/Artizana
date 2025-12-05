// tests/integration/SignUpIntergration.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SignUp from '../../src/screens/SignUp';
import axios from 'axios';

// mock navigation so useNavigation works in tests
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('axios');

describe('SignUp Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful signup', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'mock-token' } });

    render(<SignUp />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Full Name'), 'Test User');

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: expect.any(String),
        })
      );
    });
  });

  it('shows error message when signup fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    render(<SignUp />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Full Name'), 'Test User');

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText(/already exists|failed|error/i)).toBeTruthy();
    });

    // optional assertion if you later render an error text in SignUp
    // expect(screen.getByText(/failed|error|invalid/i)).toBeTruthy();
  });
});
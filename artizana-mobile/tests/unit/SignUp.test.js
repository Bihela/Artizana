import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import axios from 'axios';
import SignUp from '../../src/screens/SignUp';

jest.mock('axios');

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits form with valid data', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: 'mock-token' } });

    render(<SignUp />);

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.changeText(screen.getByPlaceholderText('Name'), 'Test User');

    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
          role: 'Buyer',
        }),
        //handles config argument (headers, timeout, etc.)
        expect.any(Object)
      );
    });
  });
});

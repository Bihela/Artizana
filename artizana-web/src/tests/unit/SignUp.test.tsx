// src/__tests__/unit/SignUp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUp from '../../pages/SignUp';

// important: mock both useNavigate and Link
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ children, ...props }: { children: React.ReactNode }) => <a {...props}>{children}</a>,
}));

jest.mock('axios');

describe('SignUp Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (axios.post as jest.Mock).mockResolvedValue({ data: { token: 'mock-token' } });
  });

  test('renders form fields', () => {
    render(<SignUp />);
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Buyer' } });
    fireEvent.click(screen.getByLabelText(/I agree to the Terms & Conditions/i));
    fireEvent.click(screen.getByText('Sign Up with Email'));

    // Now axios.post should be called directly
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'Buyer',
        })
      );
    });

    // And navigation should go to /buyer-dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/complete-profile');
    });
  });
});

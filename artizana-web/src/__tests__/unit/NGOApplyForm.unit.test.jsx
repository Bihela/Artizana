// src/__tests__/unit/NGOApplyForm.unit.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NGOApplyForm from '../../pages/NGOApplyForm';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('axios'); // this now uses the one from setupTests.js

describe('NGOApplyForm - Unit Tests', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    axios.post.mockReset();
  });

  test('renders all form fields', () => {
    render(<NGOApplyForm />);
    expect(screen.getByText('Apply as NGO/Edu Partner')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Hope Foundation')).toBeInTheDocument();
    expect(screen.getByText('Upload NGO Logo')).toBeInTheDocument();
  });

  test('shows logo preview when valid image is uploaded', async () => {
    render(<NGOApplyForm />);

    const file = new File(['dummy'], 'logo.png', { type: 'image/png' });
    const logoInput = screen.getByTestId('logo-input');

    await userEvent.upload(logoInput, file);

    const previewImage = await screen.findByAltText('NGO Logo');

    expect(previewImage).toBeInTheDocument();
    expect(previewImage.src).toMatch(/^blob:http:\/\/localhost\/\d+$/);
  });

  test('rejects logo larger than 5MB', async () => {
    render(<NGOApplyForm />);

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    const logoInput = screen.getByTestId('logo-input');

    await userEvent.upload(logoInput, largeFile);

    expect(await screen.findByText('Logo must be under 5MB')).toBeInTheDocument();
    expect(screen.queryByAltText('NGO Logo')).not.toBeInTheDocument();
  });

  test('submits form successfully with required files', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<NGOApplyForm />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Hope Foundation'), { target: { value: 'Hope NGO' } });
    fireEvent.change(screen.getByPlaceholderText('NGO-DARPAN ID or Certificate No.'), { target: { value: 'REG123' } });
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Priya' } });
    fireEvent.change(screen.getByPlaceholderText('contact@ngo.org'), { target: { value: 'priya@hope.org' } });
    fireEvent.change(screen.getByPlaceholderText('+91 98765 43210'), { target: { value: '+919876543210' } });
    fireEvent.change(screen.getByPlaceholderText('Full address'), { target: { value: 'Delhi' } });
    fireEvent.change(screen.getByPlaceholderText('Tell us about your mission and impact...'), {
      target: { value: 'We help artisans. '.repeat(10) },
    });

    const fileInputs = screen.getAllByTestId('file-input');
    await userEvent.upload(fileInputs[0], new File([''], 'cert.pdf', { type: 'application/pdf' }));
    await userEvent.upload(fileInputs[1], new File([''], 'proof.jpg', { type: 'image/jpeg' }));

    fireEvent.click(screen.getByText('Submit Application'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/ngo-success');
    });
  });

  test('shows error on submission failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { error: 'Server error' } } });

    render(<NGOApplyForm />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Hope Foundation'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Submit Application'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});
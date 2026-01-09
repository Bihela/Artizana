// src/__tests__/integration/NGOApplyForm.integration.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock navigate
const mockNavigate = jest.fn();
jest.doMock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const NGOApplyForm = require('../../pages/NGOApplyForm').default;
jest.mock('axios');

describe('NGOApplyForm - Integration Test', () => {
  beforeEach(() => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
    mockNavigate.mockReset();
  });

  test('submits successfully and navigates', async () => {
    render(
      <MemoryRouter>
        <NGOApplyForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText('e.g. Hope Foundation'), 'Light NGO');
    await userEvent.type(screen.getByPlaceholderText('NGO-DARPAN ID or Certificate No.'), 'NGO999');
    await userEvent.type(screen.getByPlaceholderText('John Doe'), 'Anita');
    await userEvent.type(screen.getByPlaceholderText('contact@ngo.org'), 'anita@ngo.org');
    await userEvent.type(screen.getByPlaceholderText('+91 98765 43210'), '+919900000000');
    await userEvent.type(screen.getByPlaceholderText('Full address'), 'Mumbai');
    await userEvent.type(screen.getByPlaceholderText('Tell us about your mission and impact...'), 'We empower artisans. '.repeat(5));

    const fileInputs = screen.getAllByTestId('file-input');
    await userEvent.upload(fileInputs[0], new File([''], 'cert.pdf', { type: 'application/pdf' }));
    await userEvent.upload(fileInputs[1], new File([''], 'proof.jpg', { type: 'image/jpeg' }));

    await userEvent.click(screen.getByText('Submit Application'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ngo-success');
    });
  }, 10000); // Increase timeout
});
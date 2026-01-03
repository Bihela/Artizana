// src/__tests__/integration/CompleteProfileIntegration.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// MOCK react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams({ token: 'mock-token' })], // Simulate query param
}));

// MOCK axios
jest.mock('axios', () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(), // If needed
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        }
    }))
}));


import CompleteProfile from '../../pages/CompleteProfile';

describe('CompleteProfile Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('loads user data and pre-fills form', async () => {
        // Mock GET /me
        axios.get.mockResolvedValue({
            data: {
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'Buyer', // Should show Buyer fields
                    phoneNumber: '',
                    shippingAddress: ''
                }
            }
        });

        render(
            <MemoryRouter>
                <CompleteProfile />
            </MemoryRouter>
        );

        // Should fetch user data
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Check if name is pre-filled
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
        });

        // Check if Buyer fields are shown
        expect(screen.getByText('Buyer Details')).toBeInTheDocument();
        expect(screen.getByText('Phone Number')).toBeInTheDocument();
    });

    test('submits form and redirects to dashboard', async () => {
        // Mock GET /me
        axios.get.mockResolvedValue({
            data: {
                user: { role: 'Buyer', name: 'Test', email: 't@t.com' }
            }
        });

        // Mock PUT /update-profile
        axios.put.mockResolvedValue({ data: { token: 'new-token' } });

        const { container } = render(
            <MemoryRouter>
                <CompleteProfile />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Wait for form to load
        await waitFor(() => {
            expect(container.querySelector('input[name="phoneNumber"]')).toBeInTheDocument();
        });

        // Fill required Buyer fields
        const phoneInput = container.querySelector('input[name="phoneNumber"]');
        const addressInput = container.querySelector('textarea[name="shippingAddress"]');

        fireEvent.change(phoneInput, { target: { value: '0771234567' } });
        fireEvent.change(addressInput, { target: { value: '123 Street' } });

        // Click Submit
        fireEvent.click(screen.getByText('Complete Profile'));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/buyer-dashboard');
        });
    });
});

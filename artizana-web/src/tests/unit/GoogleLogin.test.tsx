import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from '../../pages/Login';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: () => ({ state: null })
}));

// Mock firebase/auth
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithPopup: jest.fn(),
    GoogleAuthProvider: {
        credentialFromResult: jest.fn()
    }
}));

// Mock firebase config
jest.mock('../../firebase', () => ({
    auth: {},
    googleProvider: {}
}));


describe('Login Component - Google Sign In', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls google sign-in and backend endpoint on button click', async () => {
        // Mock success from Firebase
        const mockUser = { uid: '123' };
        const mockResult = { user: mockUser };
        (signInWithPopup as jest.Mock).mockResolvedValue(mockResult);

        (GoogleAuthProvider.credentialFromResult as jest.Mock).mockReturnValue({
            idToken: 'mock_google_token'
        });

        // Mock success from backend
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                token: 'backend_jwt',
                user: { role: 'Buyer', name: 'Test User' }
            })
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const googleBtn = screen.getByRole('button', { name: /google/i });
        fireEvent.click(googleBtn);

        // Verify Firebase was called
        await waitFor(() => {
            expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
        });

        // Verify backend was called with CORRECT token
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/google-web'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ idToken: 'mock_google_token' })
                })
            );
        });

        // Verify navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/buyer-dashboard');
        });
    });

    test('handles backend error gracefully', async () => {
        // Mock success from Firebase
        (signInWithPopup as jest.Mock).mockResolvedValue({ user: {} });
        (GoogleAuthProvider.credentialFromResult as jest.Mock).mockReturnValue({
            idToken: 'mock_google_token'
        });

        // Mock failure from backend
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Invalid token' })
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /google/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid token/i)).toBeInTheDocument();
            // Or check if error state is displayed. 
            // Login.js sets error state: setError(err.message || "Google sign-in failed");
        });
    });
});

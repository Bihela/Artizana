// src/__tests__/integration/ProfileFlow.test.js
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));
const mockedAxios = require('axios');

describe('Profile Flow Integration', () => {
    beforeEach(() => {
        // Initialize localStorage with authToken to bypass login check
        localStorage.setItem('authToken', 'mock-token');
    });

    afterEach(() => {
        localStorage.removeItem('authToken');
    });

    test('navigates to Profile and displays data', async () => {
        const mockUser = {
            name: 'Integration User',
            email: 'int@example.com',
            role: 'Buyer',
            profilePhoto: null
        };

        mockedAxios.get.mockResolvedValueOnce({
            data: { user: mockUser }
        });

        // We need to render App and navigate to /profile
        // Since we can't easily control window.location in JSDOM without history API mocks,
        // we can assume the user clicks a link or we can manually push to history.
        // For this test, we'll use window.history.pushState
        window.history.pushState({}, 'Profile', '/profile');

        render(<App />);

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toBeInTheDocument();
        });

        expect(screen.getByText('Integration User')).toBeInTheDocument();
        expect(screen.getByText('No recent activity')).toBeInTheDocument();
    });
});

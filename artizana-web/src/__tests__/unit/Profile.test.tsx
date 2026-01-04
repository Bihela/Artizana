// src/__tests__/unit/Profile.test.js
import { render, screen, waitFor } from '@testing-library/react';
import Profile from '../../pages/Profile';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));
const mockedAxios = require('axios');

// Mock Navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe('Profile Page Unit Test', () => {
    beforeEach(() => {
        // Clear mocks
        mockedAxios.get.mockReset();
        mockedNavigate.mockReset();
        // Set mock token
        localStorage.setItem('authToken', 'mock-token');
    });

    afterEach(() => {
        localStorage.removeItem('authToken');
    });

    test('renders loading state initially', () => {
        // Return a promise that never resolves to test loading state
        mockedAxios.get.mockImplementation(() => new Promise(() => { }));
        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders user profile data after fetch', async () => {
        const mockUser = {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Buyer',
            profilePhoto: 'http://example.com/photo.jpg'
        };

        mockedAxios.get.mockResolvedValueOnce({
            data: { user: mockUser }
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(screen.getByTestId('user-name')).toBeInTheDocument();
        });

        expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
        expect(screen.getByAltText('John Doe')).toHaveAttribute('src', 'http://example.com/photo.jpg');
    });
});

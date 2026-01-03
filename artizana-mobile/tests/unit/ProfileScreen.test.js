// tests/unit/ProfileScreen.test.js
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/ProfileScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));
jest.mock('expo-constants', () => ({
    expoConfig: {
        extra: {
            apiBaseUrl: 'http://localhost:5001/api'
        }
    }
}));

const mockNavigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
};

describe('ProfileScreen Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        AsyncStorage.getItem.mockResolvedValue('mock-token');
    });

    test('renders loading state initially', async () => {
        axios.get.mockImplementation(() => new Promise(() => { })); // Never resolves
        const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);
        expect(getByText('Loading...')).toBeTruthy();
    });

    test('renders user profile data after fetch', async () => {
        const mockUser = {
            name: 'Mobile User',
            email: 'mobile@example.com',
            role: 'Artisan',
            profilePhoto: 'http://example.com/mobile.jpg'
        };

        axios.get.mockResolvedValueOnce({
            data: { user: mockUser }
        });

        const { getByText, debug } = render(<ProfileScreen navigation={mockNavigation} />);

        await waitFor(() => {
            try {
                expect(getByText('Mobile User')).toBeTruthy();
            } catch (e) {
                // debug(); // Uncomment to see render output on failure
                throw e;
            }
        }, { timeout: 3000 }); // Explicit timeout shorter than jest timeout to see error? No, default is 1000. Jest timeout is 5000.

        expect(getByText('mobile@example.com')).toBeTruthy();
        expect(getByText('Artisan')).toBeTruthy();
        expect(getByText('No recent activity')).toBeTruthy();
    });

    test('redirects to Login if no token', async () => {
        AsyncStorage.getItem.mockResolvedValue(null); // No token
        render(<ProfileScreen navigation={mockNavigation} />);

        await waitFor(() => {
            expect(mockNavigation.replace).toHaveBeenCalledWith('Login');
        });
    });
});

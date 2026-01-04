// tests/unit/ProfileScreen.test.js
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../src/screens/ProfileScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
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
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
} as any;

describe('ProfileScreen Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset defaults
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mock-token');
        (axios.get as jest.Mock).mockReset();
    });

    test('renders loading state initially', async () => {
        (axios.get as jest.Mock).mockImplementation(() => new Promise(() => { })); // Never resolves
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

        (axios.get as jest.Mock).mockResolvedValue({
            data: { user: mockUser }
        });

        const { getByText } = render(<ProfileScreen navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Mobile User')).toBeTruthy();
        });

        expect(getByText('mobile@example.com')).toBeTruthy();
        expect(getByText('Artisan')).toBeTruthy();
        expect(getByText('No recent activity')).toBeTruthy();
    });

    test('redirects to Login if no token', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null); // No token
        render(<ProfileScreen navigation={mockNavigation} />);

        await waitFor(() => {
            expect(mockNavigation.replace).toHaveBeenCalledWith('Login');
        });
    });
});

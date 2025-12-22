
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CompleteProfile from '../../src/screens/CompleteProfile';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mocks
jest.mock('axios');
jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));
jest.mock('expo-constants', () => ({
    expoConfig: { extra: { apiBaseUrl: 'http://localhost:5001/api' } },
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('CompleteProfile Screen', () => {
    const mockNavigation = {
        replace: jest.fn(),
        navigate: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        AsyncStorage.getItem.mockResolvedValue('mock-token');
    });

    test('renders correctly and loads buyer data', async () => {
        axios.get.mockResolvedValue({
            data: {
                user: {
                    name: 'Test Mobile',
                    email: 'mobile@test.com',
                    role: 'Buyer',
                    phoneNumber: '',
                    shippingAddress: '',
                },
            },
        });

        const { getByText, getAllByText } = render(
            <CompleteProfile navigation={mockNavigation} />
        );

        // Should fetch user
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Check rendering
        expect(getByText('Buyer Details')).toBeTruthy();
        // Header and Button both say "Complete Profile"
        const elements = getAllByText('Complete Profile');
        expect(elements.length).toBeGreaterThan(0);
    });

    test('submits form and navigates to dashboard', async () => {
        // Mock User Load
        axios.get.mockResolvedValue({
            data: {
                user: { role: 'Buyer', name: 'Test', email: 'test@test.com' },
            },
        });

        // Mock Update
        axios.put.mockResolvedValue({ data: { token: 'new-token' } });

        const { getByTestId } = render(
            <CompleteProfile navigation={mockNavigation} />
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Find elements by testID
        const phoneInput = getByTestId('input-phone');
        const addressInput = getByTestId('input-address');
        const submitButton = getByTestId('button-submit');

        // Enter data
        fireEvent.changeText(phoneInput, '0771234567');
        fireEvent.changeText(addressInput, '123 Test Street');

        // Submit
        fireEvent.press(submitButton);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalled();
            expect(mockNavigation.replace).toHaveBeenCalledWith('MainTabs');
        });
    });
});

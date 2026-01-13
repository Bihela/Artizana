import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import ProductDetailsScreen from '../../src/screens/ProductDetailsScreen';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
    useRoute: () => ({
        params: { productId: '123' },
    }),
}));

describe('ProductDetailsScreen Integration', () => {
    const mockProduct = {
        _id: '123',
        title: 'Mobile Pottery',
        description: 'Mobile description here.',
        price: 99.00,
        images: ['https://example.com/mobile.jpg'],
        quantity: 5,
        artisan: {
            name: 'Mobile Artisan',
            profilePhoto: 'https://example.com/mobile-profile.jpg'
        },
        reviews: []
    };

    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({ data: mockProduct });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders product details correctly', async () => {
        const { getByText, getByTestId } = render(<ProductDetailsScreen />);

        // Wait for product load
        await waitFor(() => {
            expect(getByText('Mobile Pottery')).toBeTruthy();
        });

        expect(getByText('LKR 99')).toBeTruthy();
        expect(getByText('Mobile description here.')).toBeTruthy();
        expect(getByText('Mobile Artisan')).toBeTruthy();
        expect(getByText('Stock: 5 left')).toBeTruthy();
        expect(getByText('Add to Cart')).toBeTruthy();
    });
});

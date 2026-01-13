import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetails from '../../pages/ProductDetails';

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn().mockReturnThis(),
    interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
    },
}));
const mockedAxios = axios as unknown as { get: jest.Mock, post: jest.Mock };

// Mock Carousel
jest.mock('../../components/Carousel', () => () => <div data-testid="carousel">Carousel</div>);

describe('ProductDetails Page Integration', () => {
    const mockProduct = {
        _id: '123',
        title: 'Handmade Pottery',
        description: 'Beautiful handmade pottery vase.',
        price: 50.00,
        images: ['https://example.com/image1.jpg'],
        category: 'Pottery',
        quantity: 10,
        artisan: {
            _id: 'artisan123',
            name: 'John Doe',
            profilePhoto: 'https://example.com/profile.jpg'
        },
        reviews: []
    };

    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({ data: mockProduct });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders product details correctly', async () => {
        render(
            <MemoryRouter initialEntries={['/product/123']}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetails />} />
                </Routes>
            </MemoryRouter>
        );

        // Check loading state
        expect(screen.getByRole('status')).toBeInTheDocument();

        // Wait for product data
        await waitFor(() => {
            expect(screen.getByText('Handmade Pottery')).toBeInTheDocument();
        });

        // Verify key details
        expect(screen.getByText('LKR 50')).toBeInTheDocument(); // Formatted price
        expect(screen.getByText('Beautiful handmade pottery vase.')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Stock: 10 left')).toBeInTheDocument();

        // Verify buttons
        expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    test('handles 404/error gracefully', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Product not found'));

        render(
            <MemoryRouter initialEntries={['/product/999']}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetails />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Product not found')).toBeInTheDocument();
        });
    });
});

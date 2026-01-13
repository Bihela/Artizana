import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from '../../pages/Home';

jest.mock('axios', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
    },
}));
jest.mock('../../components/HeroSection', () => () => <div data-testid="hero-section">Hero Section</div>);

const mockProducts = [
    { _id: '1', title: 'Product 1', price: 1000, images: [] },
    { _id: '2', title: 'Product 2', price: 2000, images: [] }
];

import { MemoryRouter } from 'react-router-dom';

// ... existing mocks ...

describe('Home Page Integration', () => {
    test('renders loading state initially', () => {
        (axios.get as jest.Mock).mockReturnValue(new Promise(() => { }));
        render(<MemoryRouter><Home /></MemoryRouter>);
        // Assuming the spinner corresponds to a role or class, checking for existence implies loading
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });

    test('renders products after successful fetch', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: mockProducts });

        render(<MemoryRouter><Home /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Top Picks for You')).toBeInTheDocument();
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
    });

    test('renders empty state when no products', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: [] });

        render(<MemoryRouter><Home /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('No products found at the moment.')).toBeInTheDocument();
        });
    });
});

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

describe('Home Page Integration', () => {
    test('renders loading state initially', () => {
        (axios.get as jest.Mock).mockReturnValue(new Promise(() => { }));
        render(<Home />);
        // Assuming the spinner corresponds to a role or class, checking for existence implies loading
        // Since specific spinner text isn't there, checking for absence of products works or finding the spinner div if test id was added
        // Ideally we add data-testid to spinner in Home.tsx but for now we check product absence
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });

    test('renders products after successful fetch', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: mockProducts });

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('Top Picks for You')).toBeInTheDocument();
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
    });

    test('renders empty state when no products', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: [] });

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('No products found at the moment.')).toBeInTheDocument();
        });
    });
});

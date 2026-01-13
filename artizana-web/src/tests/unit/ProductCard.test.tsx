import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';

import { MemoryRouter } from 'react-router-dom';

const mockProduct = {
    _id: '1',
    title: 'Test Product',
    price: 5000,
    images: ['https://example.com/image.jpg'],
    artisan: { name: 'Test Artisan' }
};

describe('ProductCard Component', () => {
    test('renders product details correctly', () => {
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('LKR 5,000')).toBeInTheDocument();
        expect(screen.getByText(/By Test Artisan/)).toBeInTheDocument();
        const image = screen.getByAltText('Test Product');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    test('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(
            <MemoryRouter>
                <ProductCard product={mockProduct} onClick={handleClick} />
            </MemoryRouter>
        );

        const card = screen.getByText('Test Product').closest('div');
        expect(card).not.toBeNull();
        fireEvent.click(card!);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

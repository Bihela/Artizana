import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../components/ProductCard';

const mockProduct = {
    _id: '1',
    title: 'Test Product',
    price: 5000,
    images: ['https://example.com/image.jpg'],
    artisan: { name: 'Test Artisan' }
};

describe('ProductCard Component', () => {
    test('renders product details correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('LKR 5,000')).toBeInTheDocument();
        expect(screen.getByText(/By Test Artisan/)).toBeInTheDocument();
        const image = screen.getByAltText('Test Product');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    test('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<ProductCard product={mockProduct} onClick={handleClick} />);

        const card = screen.getByText('Test Product').closest('div');
        expect(card).not.toBeNull();
        fireEvent.click(card!);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

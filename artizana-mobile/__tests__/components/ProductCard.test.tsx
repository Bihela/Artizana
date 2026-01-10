import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../src/components/ProductCard';

const mockProduct = {
    _id: '1',
    title: 'Mobile Product',
    price: 3500,
    images: ['https://example.com/mobile-img.jpg'],
    artisan: { name: 'Mobile Artisan' }
};

describe('ProductCard Component (Mobile)', () => {
    test('renders product info correctly', () => {
        const { getByText } = render(<ProductCard product={mockProduct} />);

        expect(getByText('Mobile Product')).toBeTruthy();
        expect(getByText('LKR 3,500')).toBeTruthy();
        expect(getByText('By Mobile Artisan')).toBeTruthy();
    });

    test('calls onPress event', () => {
        const handlePress = jest.fn();
        const { getByText } = render(<ProductCard product={mockProduct} onPress={handlePress} />);

        fireEvent.press(getByText('Mobile Product'));
        expect(handlePress).toHaveBeenCalled();
    });
});

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Carousel from '../../components/Carousel';

describe('Web Carousel Component', () => {
    const mockImages = [
        'img1.jpg',
        'img2.jpg',
        'img3.jpg',
    ];

    beforeAll(() => {
        // Mock scroll methods since they are not available in JSDOM
        Element.prototype.scrollTo = jest.fn();
    });

    test('renders images correctly', () => {
        render(<Carousel images={mockImages} />);
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);
        expect(images[0]).toHaveAttribute('src', 'img1.jpg');
    });

    test('navigates with arrow buttons', () => {
        render(<Carousel images={mockImages} />);

        // Check for next button presence
        const nextBtn = screen.getByLabelText('Next Slide');
        expect(nextBtn).toBeInTheDocument();

        // Click next
        fireEvent.click(nextBtn);

        // We expect scrollTo to be called to move the slide
        expect(Element.prototype.scrollTo).toHaveBeenCalled();
    });

    test('navigates with dots', () => {
        render(<Carousel images={mockImages} />);
        const dots = screen.getAllByRole('button', { name: /Go to slide/i });
        expect(dots).toHaveLength(3);

        fireEvent.click(dots[2]);
        // Expect active index change and scroll
        expect(Element.prototype.scrollTo).toHaveBeenCalled();
    });

    test('handles empty image array', () => {
        render(<Carousel images={[]} />);
        expect(screen.getByText('No Images Available')).toBeInTheDocument();
    });
});

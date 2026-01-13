import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../../pages/Home';
import { LanguageProvider } from '../../context/LanguageContext';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../../components/HeroSection', () => () => <div data-testid="hero-section">Hero Section</div>);
jest.mock('../../components/ProductCard', () => () => <div data-testid="product-card">Product Card</div>);
// Mock the Modal to test functionality
jest.mock('../../components/LanguageSelectorModal', () => ({ onSelect }: { onSelect: (lang: string) => void }) => (
    <div data-testid="language-modal">
        <button onClick={() => onSelect('en')}>English</button>
        <button onClick={() => onSelect('si')}>Sinhala</button>
    </div>
));

describe('Home Page Language Selection', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('shows language modal for first-time users (no language set)', async () => {
        render(
            <LanguageProvider>
                <Home />
            </LanguageProvider>
        );

        expect(await screen.findByTestId('language-modal')).toBeInTheDocument();
    });

    it('does not show modal if language is already set', async () => {
        localStorage.setItem('userLanguage', 'en');
        render(
            <LanguageProvider>
                <Home />
            </LanguageProvider>
        );

        // Wait to ensure it doesn't appear
        await waitFor(() => {
            expect(screen.queryByTestId('language-modal')).not.toBeInTheDocument();
        });
    });

    it('saves language when selected', async () => {
        render(
            <LanguageProvider>
                <Home />
            </LanguageProvider>
        );

        const modal = await screen.findByTestId('language-modal');
        expect(modal).toBeInTheDocument();

        fireEvent.click(screen.getByText('English'));

        expect(localStorage.getItem('userLanguage')).toBe('en');
        // Modal should close
        await waitFor(() => {
            expect(screen.queryByTestId('language-modal')).not.toBeInTheDocument();
        });
    });
});

// tests/unit/HomeScreen.language.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { LanguageProvider } from '../../src/context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the HeroSection and ProductCard to avoid rendering complex children
jest.mock('../../src/components/HeroSection', () => 'HeroSection');
jest.mock('../../src/components/ProductCard', () => 'ProductCard');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('HomeScreen - KAN-9 Language Selector', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockNavigation = {
        navigate: jest.fn(),
    };

    it('shows language modal when no preferredLanguage is stored', async () => {
        // Mock AsyncStorage to return null for language, simulating first-time user
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === 'userLanguage') return Promise.resolve(null);
            return Promise.resolve(null);
        });

        const { getByText } = render(
            <LanguageProvider>
                <HomeScreen navigation={mockNavigation} />
            </LanguageProvider>
        );

        // Expect the modal title and options to appear
        await waitFor(() => {
            expect(getByText(/Choose your language/i)).toBeTruthy();
            expect(getByText(/English/)).toBeTruthy();
            expect(getByText(/සිංහල/)).toBeTruthy();
        });
    });

    it('does not show modal when preferredLanguage exists', async () => {
        // Mock AsyncStorage to return 'en'
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === 'userLanguage') return Promise.resolve('en');
            return Promise.resolve(null);
        });

        const { queryByText } = render(
            <LanguageProvider>
                <HomeScreen navigation={mockNavigation} />
            </LanguageProvider>
        );

        // Expect the modal to be absent (null)
        await waitFor(() => {
            expect(queryByText(/Choose your language/i)).toBeNull();
        });
    });
});

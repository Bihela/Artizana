// tests/unit/HomeScreen.language.test.js
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { LanguageProvider } from '../../src/context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

describe('HomeScreen - KAN-9 Language Selector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockNavigation = {
    navigate: jest.fn(),
  };

  it('shows language modal when no preferredLanguage is stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByText } = render(
      <LanguageProvider>
        <HomeScreen navigation={mockNavigation} />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(getByText(/Choose your language/i)).toBeTruthy();
      expect(getByText(/English/)).toBeTruthy();
      expect(getByText(/සිංහල/)).toBeTruthy();
    });
  });

  it('does not show modal when preferredLanguage exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('en');

    const { queryByText, getByText } = render(
      <LanguageProvider>
        <HomeScreen navigation={mockNavigation} />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(queryByText(/Choose your language/i)).toBeNull();
      expect(getByText(/Session Language/i)).toBeTruthy();
      expect(getByText(/English/)).toBeTruthy();
    });
  });
});

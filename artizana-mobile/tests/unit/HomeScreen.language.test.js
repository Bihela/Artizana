// tests/unit/HomeScreen.language.test.js
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('HomeScreen - KAN-9 Language Selector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows language modal when no preferredLanguage is stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText(/Choose your language/i)).toBeTruthy();
      expect(getByText(/English/)).toBeTruthy();
      expect(getByText(/සිංහල/)).toBeTruthy();
    });
  });

  it('does not show modal when preferredLanguage exists', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('en');

    const { queryByText, getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(queryByText(/Choose your language/i)).toBeNull();
      expect(getByText(/Session Language/i)).toBeTruthy();
      expect(getByText(/English/)).toBeTruthy();
    });
  });
});

// src/__tests__/unit/HomePage.language.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../pages/BuyerHome';

function mockLocalStorage(initial = {}) {
  let store = { ...initial };

  const localStorageMock = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });

  return localStorageMock;
}

describe('HomePage - KAN-9 Language Selector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows language modal when no preferredLanguage is stored', () => {
    mockLocalStorage(); // nothing stored

    render(<HomePage />);

    // Modal heading from LanguageSelectorModal
    expect(screen.getByText(/Choose your lanaguage/i)).toBeInTheDocument();
    expect(screen.getByText(/English/i)).toBeInTheDocument();
    expect(screen.getByText(/සිංහල/i)).toBeInTheDocument();
  });

  test('does not show modal when preferredLanguage exists', () => {
    mockLocalStorage({ preferredLanguage: 'en' });

    render(<HomePage />);

    // Modal should NOT be there
    expect(screen.queryByText(/Choose your language/i)).toBeNull();

    // Dashboard content should show current selection
    expect(screen.getByText(/Session Language/i)).toBeInTheDocument();
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });
});

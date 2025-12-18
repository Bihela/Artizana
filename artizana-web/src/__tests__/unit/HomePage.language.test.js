// src/__tests__/unit/HomePage.language.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../pages/Home';

describe('HomePage - Language Selector', () => {
  test('shows language modal by default', () => {
    render(<Home />);

    // Modal heading from LanguageSelectorModal
    expect(screen.getByText(/Choose your language/i)).toBeInTheDocument();
    expect(screen.getByText(/English/i)).toBeInTheDocument();
    expect(screen.getByText(/සිංහල/i)).toBeInTheDocument();
  });

  test('closes modal when language is selected', () => {
    render(<Home />);

    const englishBtn = screen.getByText(/English/i);
    fireEvent.click(englishBtn);

    // Modal should disappear (Home.js sets isModalOpen to false)
    expect(screen.queryByText(/Choose your language/i)).toBeNull();
  });
});

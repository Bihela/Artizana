// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Artizana heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /artizana/i })).toBeInTheDocument();
});
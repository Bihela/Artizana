// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from '../../App';

test('renders Choose your language heading', () => {
  render(<App />);
  expect(screen.getByText(/Choose your language/i)).toBeInTheDocument();
});
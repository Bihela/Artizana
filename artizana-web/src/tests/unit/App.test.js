import { render, screen } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

test('renders Home page with Hero section', async () => {
  axios.get.mockResolvedValue({ data: [] });
  render(<App />);
  expect(screen.getByText(/Authentic Craftsmanship/i)).toBeInTheDocument();
});
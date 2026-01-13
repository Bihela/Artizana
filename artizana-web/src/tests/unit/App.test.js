import { render, screen } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  defaults: { headers: { common: {} } },
  interceptors: { response: { use: jest.fn() } }
}));

test('renders Home page with Hero section', async () => {
  axios.get.mockResolvedValue({ data: [] });
  render(<App />);
  expect(screen.getByText(/Authentic Craftsmanship/i)).toBeInTheDocument();
});
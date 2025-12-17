// src/__tests__/unit/Login.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';

describe('Login Component', () => {
  test('renders Artizana Login heading', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/Artizana Login/i)).toBeInTheDocument();
  });
});

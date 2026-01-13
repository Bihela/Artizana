import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopBar from '../../components/TopBar';

describe('TopBar Component', () => {
    test('renders logo text', () => {
        render(
            <MemoryRouter>
                <TopBar />
            </MemoryRouter>
        );
        const linkElement = screen.getByText(/Artizana/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('renders search input', () => {
        render(
            <MemoryRouter>
                <TopBar />
            </MemoryRouter>
        );
        const searchInput = screen.getByPlaceholderText(/Search for products or artisans/i);
        expect(searchInput).toBeInTheDocument();
    });

    test('toggles profile dropdown and shows Login/Signup when not logged in', () => {
        render(
            <MemoryRouter>
                <TopBar />
            </MemoryRouter>
        );

        const profileButton = screen.getByLabelText(/User menu/i);
        fireEvent.click(profileButton);

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    });

    test('toggles profile dropdown and shows Profile/Logout when logged in', () => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() => 'fake-token');

        render(
            <MemoryRouter>
                <TopBar />
            </MemoryRouter>
        );

        const profileButton = screen.getByLabelText(/User menu/i);
        fireEvent.click(profileButton);

        expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();

        // Cleanup mock
        jest.restoreAllMocks();
    });
});

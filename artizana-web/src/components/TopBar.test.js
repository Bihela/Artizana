import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';

describe('TopBar Component', () => {
    test('renders logo text', () => {
        render(<TopBar />);
        const linkElement = screen.getByText(/Artizana/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('renders search input', () => {
        render(<TopBar />);
        const searchInput = screen.getByPlaceholderText(/Search for products or artisans/i);
        expect(searchInput).toBeInTheDocument();
    });

    test('toggles profile dropdown on click', () => {
        render(<TopBar />);

        // Check dropdown is initially not visible
        const settingsLinkBefore = screen.queryByText(/Settings/i);
        expect(settingsLinkBefore).not.toBeInTheDocument();

        // Find profile button by aria-label
        const profileButton = screen.getByLabelText(/User menu/i);

        // Click it
        fireEvent.click(profileButton);

        // Check dropdown is now visible
        const settingsLinkAfter = screen.getByText(/Settings/i);
        expect(settingsLinkAfter).toBeInTheDocument();

        const logoutLink = screen.getByText(/Logout/i);
        expect(logoutLink).toBeInTheDocument();
    });
});

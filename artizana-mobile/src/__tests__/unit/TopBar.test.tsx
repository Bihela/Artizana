import React from 'react';
import { render } from '@testing-library/react-native';
import TopBar from '../../components/TopBar';

// Mock the HeroIcons because they are external components (often SVGs)
jest.mock('react-native-heroicons/outline', () => ({
    Bars3Icon: () => 'Bars3Icon',
    BellIcon: () => 'BellIcon',
    Cog6ToothIcon: () => 'Cog6ToothIcon',
}));

describe('<TopBar />', () => {
    it('renders correctly', () => {
        const { getByText } = render(<TopBar />);

        // Check if the title is rendered
        expect(getByText('Artizana')).toBeTruthy();
    });

    // We can't easily check for icons by text unless we mock them to return text, 
    // which we did above.
    it('renders the menu and settings icons', () => {
        const { getByTestId } = render(<TopBar />);

        expect(getByTestId('menu-button')).toBeTruthy();
        expect(getByTestId('notifications-button')).toBeTruthy();
    });
});

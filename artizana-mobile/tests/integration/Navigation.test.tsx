import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LanguageProvider } from "../../src/context/LanguageContext";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TabNavigator from "../../src/navigation/TabNavigator";

// Mock child components to avoid async issues/rendering complexity
jest.mock('../../src/components/HeroSection', () => 'HeroSection');
jest.mock('../../src/components/ProductCard', () => 'ProductCard');
jest.mock('../../src/components/LanguageSelectorModal', () => {
    const { Text } = require('react-native');
    return ({ visible }: { visible: boolean }) => visible ? <Text>Choose your language</Text> : null;
});

// Mock axios to prevent "ERR_INVALID_URL"
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: [] })),
}));



describe("TabNavigator Integration", () => {
    it("renders 4 bottom tabs for Buyer", () => {
        const { getByText, queryByText } = render(
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        );

        expect(getByText("Home")).toBeTruthy();
        expect(getByText("Orders")).toBeTruthy();
        expect(getByText("Workshops")).toBeTruthy();
        expect(getByText("Profile")).toBeTruthy();
        expect(queryByText("My Shop")).toBeNull();
    });

    it("navigates to Orders tab when pressed", async () => {
        const { getByText, getAllByText, findByText } = render(
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        );

        // confirm we are on Home first (Header "Artizana")
        expect(await findByText("Artizana")).toBeTruthy();

        // press Orders tab label
        fireEvent.press(getByText("Orders"));

        // Orders will appear twice (tab label + screen content), so use getAllByText
        await waitFor(() => {
            const matches = getAllByText("Orders");
            expect(matches.length).toBeGreaterThan(1);
        });
    });

    it("shows Language Selector when landing on Home from fresh start (simulating Post-SignUp)", async () => {
        // Mock no language set
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === 'userLanguage') return Promise.resolve(null);
            return Promise.resolve(null);
        });

        const { findByText } = render(
            <LanguageProvider>
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>
            </LanguageProvider>
        );

        // Expect Language Modal content
        await waitFor(async () => {
            // Use findByText inside waitFor or just expect with getByText
            // findByText is already async retry, but sometimes waitFor is safer for complex effects
            expect(await findByText("Choose your language")).toBeTruthy();
        });
    });
});

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TabNavigator from "../../src/navigation/TabNavigator";



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

        // confirm we are on Home first
        expect(await findByText("Buyer Dashboard")).toBeTruthy();

        // press Orders tab label
        fireEvent.press(getByText("Orders"));

        // Orders will appear twice (tab label + screen content), so use getAllByText
        await waitFor(() => {
            const matches = getAllByText("Orders");
            expect(matches.length).toBeGreaterThan(1);
        });
    });
});

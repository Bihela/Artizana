import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TabNavigator from "../../navigation/TabNavigator";

describe("TabNavigator Integration", () => {
    it("renders 5 bottom tabs", () => {
        const { getByText } = render(
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        );

        expect(getByText("Home")).toBeTruthy();
        expect(getByText("Products")).toBeTruthy();
        expect(getByText("Orders")).toBeTruthy();
        expect(getByText("Analytics")).toBeTruthy();
        expect(getByText("Profile")).toBeTruthy();
    });

    it("navigates to Products tab when pressed", async () => {
        const { getByText, getAllByText, findByText } = render(
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        );

        // confirm we are on Home first
        expect(await findByText("Home Dashboard")).toBeTruthy();

        // press Products tab label
        fireEvent.press(getByText("Products"));

        // Products will appear twice (tab label + screen content), so use getAllByText
        await waitFor(() => {
            const matches = getAllByText("Products");
            expect(matches.length).toBeGreaterThan(1);
        });
    });
});

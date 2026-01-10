// jest-setup.js

const React = require("react");

jest.mock("react-native-safe-area-context", () => {
    const React = require("react");

    const SafeAreaInsetsContext = React.createContext({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });

    return {
        SafeAreaProvider: ({ children }) => children,
        SafeAreaView: ({ children }) => children,
        SafeAreaInsetsContext,
        useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    };
});

// NativeWind minimal mock
jest.mock("nativewind", () => {
    return {
        styled: (Component) => Component,
        useColorScheme: () => ({ colorScheme: "light", toggleColorScheme: jest.fn() }),
        useTailwind: () => () => ({}),
    };
});

// AsyncStorage mock
// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: {
        getItem: jest.fn(() => Promise.resolve(null)),
        setItem: jest.fn(() => Promise.resolve()),
        removeItem: jest.fn(() => Promise.resolve()),
        clear: jest.fn(() => Promise.resolve()),
    },
}));

// Heroicons mock
jest.mock("react-native-heroicons/outline", () => {
    const React = require("react");
    const { View, Text } = require("react-native");

    const MockIcon = (name) => (props) =>
        React.createElement(
            View,
            { testID: name, accessible: true },
            React.createElement(Text, {}, name)
        );

    return {
        Bars3Icon: MockIcon("Bars3Icon"),
        BellIcon: MockIcon("BellIcon"),
        Cog6ToothIcon: MockIcon("Cog6ToothIcon"),
        HomeIcon: MockIcon("HomeIcon"),
        Squares2X2Icon: MockIcon("Squares2X2Icon"),
        ClipboardDocumentListIcon: MockIcon("ClipboardDocumentListIcon"),
        ChartBarIcon: MockIcon("ChartBarIcon"),
        UserCircleIcon: MockIcon("UserCircleIcon"),
        ShoppingBagIcon: MockIcon("ShoppingBagIcon"),
        AcademicCapIcon: MockIcon("AcademicCapIcon"),
    };
});

// jest.config.js at artizana mobile root
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-native|@react-navigation|@react-native-async-storage/async-storage|expo(nent)?|expo-status-bar|@expo-google-fonts|@unimodules|unimodules|sentry-expo|native-base|nativewind|react-native-heroicons|react-native-svg|react-native-safe-area-context|react-native-screens)",
  ],
  setupFiles: ["./jest-setup.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testMatch: ["**/__tests__/**/*.test.js", "**/tests/**/*.test.js"],
};

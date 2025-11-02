export default {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@expo|expo(nent)?|@expo-google-fonts|@unimodules|unimodules|sentry-expo|native-base)',
  ],
  testMatch: ['**/__tests__/**/*.test.js', '**/tests/**/*.test.js'],
};

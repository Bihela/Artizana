import 'dotenv/config';  // Loads .env file

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      apiBaseUrl: process.env.API_BASE_URL,  // Fallback
      // Google OAuth client IDs (set these in your environment or EAS secrets)
      // Provide sensible defaults for team development; secrets should still
      // be stored via EAS secrets or environment variables for production.
      googleExpoClientId: process.env.GOOGLE_EXPO_CLIENT_ID || null,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID || null,
      // Recommended Android client ID for team testing (non-secret)
      googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '920666001666-hov9e5t2a5tnncs5de0m3d6f91e1qa52.apps.googleusercontent.com',
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || '920666001666-8ec2tr76jpgthvgl710eqinlv3vui9c6.apps.googleusercontent.com',
    },
  };
};
import 'dotenv/config';  // Loads .env file

export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',  // Fallback
    },
  };
};
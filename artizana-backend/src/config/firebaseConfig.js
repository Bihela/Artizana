// backend/config/firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyAmoLAQWQliWl27Dzg9UxqMSVA_OCaeBUs",
  authDomain: "artizana-web-project.firebaseapp.com",
  projectId: "artizana-web-project",
  storageBucket: "artizana-web-project.firebasestorage.app",
  messagingSenderId: "920666001666",
  appId: "1:920666001666:web:unknown"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
// backend/config/firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyA0-73Emnwe4he6ygVg_3jXt__Aj-HMW48",
  authDomain: "artizana-1b277.firebaseapp.com",
  projectId: "artizana-1b277",
  storageBucket: "artizana-1b277.firebasestorage.app",
  messagingSenderId: "1047067805234",
  appId: "1:1047067805234:web:a437b155e5ce868eb8de2b",
  measurementId: "G-9KP8B6D0YJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
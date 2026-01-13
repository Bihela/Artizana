import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAmoLAQWQliWl27Dzg9UxqMSVA_OCaeBUs",
    authDomain: "artizana-web-project.firebaseapp.com",
    projectId: "artizana-web-project",
    storageBucket: "artizana-web-project.firebasestorage.app",
    messagingSenderId: "920666001666",
    appId: "1:920666001666:web:unknown",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, storage, googleProvider };

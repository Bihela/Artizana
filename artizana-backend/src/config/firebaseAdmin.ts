import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let firebaseApp: admin.app.App | null = null;

try {
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully.');
    } else {
        console.warn('WARNING: serviceAccountKey.json not found in src/config/.');
        console.warn('Firebase Admin features (Custom Tokens) will be disabled.');
    }
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
}

export default firebaseApp;

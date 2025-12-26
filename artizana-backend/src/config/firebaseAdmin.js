const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let firebaseApp = null;

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

module.exports = firebaseApp;

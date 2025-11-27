// src/utils/uploadToFirebase.js
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../config/firebaseConfig');

const uploadFileToFirebase = async (fileBuffer, originalName, folder = 'ngo-documents') => {
  try {
    const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Firebase upload failed:', error);
    throw new Error('File upload failed');
  }
};

module.exports = { uploadFileToFirebase };
// src/utils/uploadToFirebase.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export const uploadFileToFirebase = async (fileBuffer: Buffer, originalName: string, folder = 'ngo-documents'): Promise<string> => {
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
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Named Firestore Database instance
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Firebase Cloud Storage instance
export const storage = getStorage(app);

// Helper function to upload property images or avatar to Firebase Storage
export async function uploadPropertyImage(file: File, path: string = 'properties'): Promise<string> {
  try {
    const fileRef = ref(storage, `${path}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.warn('Firebase storage upload fallback to local URL:', error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

export default {
  app,
  auth,
  db,
  storage,
  googleProvider,
  uploadPropertyImage,
  sendPasswordResetEmail,
  updateFirebaseProfile
};

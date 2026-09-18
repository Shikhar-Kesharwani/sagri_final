import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Initialize Firebase safely only if API key is provided
let authInstance: Auth;
if (firebaseApiKey) {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
} else {
  authInstance = {} as Auth;
}

export const auth = authInstance;

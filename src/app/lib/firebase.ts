import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCh8gQiHjQLyvf_EL8-aiFUTFtfApLjzs",
  authDomain: "app1-4174e.firebaseapp.com",
  projectId: "app1-4174e",
  storageBucket: "app1-4174e.firebasestorage.app",
  messagingSenderId: "15497476883",
  appId: "1:15497476883:web:31cd7405ac7a95007c78e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

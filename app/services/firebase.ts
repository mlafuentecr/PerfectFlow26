import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace with your real Firebase project configuration.
const firebaseConfig = {
  apiKey: 'AIzaSyC6ZmxUws_aJexV0vAueHruteZ_TNIyAXk',
  authDomain: 'perfectflow-6251e.firebaseapp.com',
  projectId: 'perfectflow-6251e',
  storageBucket: 'perfectflow-6251e.firebasestorage.app',
  messagingSenderId: '1052635522459',
  // IMPORTANT: replace with the Web app ID from Firebase Console -> Project settings -> Your apps (Web).
  appId: 'YOUR_WEB_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;

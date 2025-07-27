import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Usar las mismas credenciales que la versión web
  apiKey: "AIzaSyBAiCr03IolOLlX0wWPqqS9gZmXUl8Ne8Q",
  authDomain: "moodia-dda2d.firebaseapp.com",
  projectId: "moodia-dda2d",
  storageBucket: "moodia-dda2d.firebasestorage.app",
  messagingSenderId: "390565639093",
  appId: "1:390565639093:web:b810b423e118eecc9f5ffc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
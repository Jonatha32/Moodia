import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebaseConfig'; // Importa la instancia de auth
import { manageUserProfile } from './userService';

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = userCredential;

  // 1. Actualiza el perfil en Firebase Auth para que tenga el nombre
  await updateProfile(user, { displayName });

  // 2. Crea el documento de perfil en la colección 'users' de Firestore
  await manageUserProfile(user, { displayName });

  return userCredential;
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const { user } = userCredential;

  // Crea el documento de perfil si es la primera vez que inicia sesión
  await manageUserProfile(user);

  return userCredential;
};

export const logOut = () => {
  return signOut(auth);
};
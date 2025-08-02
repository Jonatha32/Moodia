import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebaseConfig';
import { UserProfile } from '../types';

/**
 * Crea un documento de perfil para un usuario si no existe.
 * Esto se usa tanto para el registro con email como para el inicio de sesión con Google.
 * @param userAuth El objeto de usuario de Firebase Auth.
 * @param additionalData Datos adicionales, como el `displayName` de un formulario.
 */
export const manageUserProfile = async (
  userAuth: User,
  additionalData?: { displayName?: string }
) => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);

  // Solo crea el documento si es un usuario nuevo
  if (!snapshot.exists()) {
    const { uid, email, photoURL } = userAuth;
    const displayName = additionalData?.displayName || userAuth.displayName;
    const createdAt = serverTimestamp();

    await setDoc(userRef, { uid, email, displayName, photoURL, createdAt });
  }
};

/**
 * Obtiene el perfil de un usuario desde Firestore.
 * @param userId El ID del usuario a buscar.
 * @returns El perfil del usuario o null si no se encuentra.
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
};
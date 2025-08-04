import { doc, setDoc, serverTimestamp, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebaseConfig';
import { UserProfile, MoodHistoryEntry, UserStats } from '../types';

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
    const username = displayName?.toLowerCase().replace(/\s+/g, '') || uid;

    await setDoc(userRef, { 
      uid, 
      email, 
      displayName, 
      photoURL, 
      createdAt,
      username,
      bio: '',
      location: '',
      currentMood: '',
      followers: [],
      following: [],
      badges: [],
      moodHistory: [],
      highlights: [],
      activeDays: 0
    });
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

/**
 * Actualiza el perfil de un usuario
 */
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, data);
};

/**
 * Sigue a un usuario
 */
export const followUser = async (currentUserId: string, targetUserId: string) => {
  console.log('followUser llamado:', { currentUserId, targetUserId });
  const currentUserRef = doc(db, 'users', currentUserId);
  const targetUserRef = doc(db, 'users', targetUserId);
  
  try {
    // Asegurar que los arrays existan
    const currentUserDoc = await getDoc(currentUserRef);
    const targetUserDoc = await getDoc(targetUserRef);
    
    if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    const currentUserData = currentUserDoc.data();
    const targetUserData = targetUserDoc.data();
    
    // Inicializar arrays si no existen
    if (!currentUserData.following) {
      await updateDoc(currentUserRef, { following: [] });
    }
    if (!targetUserData.followers) {
      await updateDoc(targetUserRef, { followers: [] });
    }
    
    await Promise.all([
      updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId)
      }),
      updateDoc(targetUserRef, {
        followers: arrayUnion(currentUserId)
      })
    ]);
    console.log('followUser completado exitosamente');
  } catch (error) {
    console.error('Error en followUser:', error);
    throw error;
  }
};

/**
 * Deja de seguir a un usuario
 */
export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
  console.log('unfollowUser llamado:', { currentUserId, targetUserId });
  const currentUserRef = doc(db, 'users', currentUserId);
  const targetUserRef = doc(db, 'users', targetUserId);
  
  try {
    // Asegurar que los arrays existan
    const currentUserDoc = await getDoc(currentUserRef);
    const targetUserDoc = await getDoc(targetUserRef);
    
    if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    const currentUserData = currentUserDoc.data();
    const targetUserData = targetUserDoc.data();
    
    // Inicializar arrays si no existen
    if (!currentUserData.following) {
      await updateDoc(currentUserRef, { following: [] });
    }
    if (!targetUserData.followers) {
      await updateDoc(targetUserRef, { followers: [] });
    }
    
    await Promise.all([
      updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId)
      }),
      updateDoc(targetUserRef, {
        followers: arrayRemove(currentUserId)
      })
    ]);
    console.log('unfollowUser completado exitosamente');
  } catch (error) {
    console.error('Error en unfollowUser:', error);
    throw error;
  }
};

/**
 * Actualiza el mood actual del usuario
 */
export const updateUserMood = async (userId: string, mood: string) => {
  const userRef = doc(db, 'users', userId);
  const moodEntry: MoodHistoryEntry = {
    date: serverTimestamp() as any,
    mood
  };
  
  await updateDoc(userRef, {
    currentMood: mood,
    moodHistory: arrayUnion(moodEntry)
  });
};

/**
 * Obtiene las estadísticas de un usuario
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  const userProfile = await getUserProfile(userId);
  
  // Contar posts del usuario
  const postsQuery = query(
    collection(db, 'posts'),
    where('userId', '==', userId)
  );
  const postsSnapshot = await getDocs(postsQuery);
  const posts = postsSnapshot.docs.map(doc => doc.data());
  
  // Calcular estadísticas
  const moodCounts = posts.reduce((acc, post) => {
    acc[post.mood] = (acc[post.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calcular streak (simplificado)
  const streakDays = calculateStreakDays(userProfile?.moodHistory || []);
  
  return {
    totalPosts: posts.length,
    followers: userProfile?.followers?.length || 0,
    following: userProfile?.following?.length || 0,
    streakDays,
    moodCounts
  };
};

/**
 * Calcula los días consecutivos de actividad
 */
const calculateStreakDays = (moodHistory: MoodHistoryEntry[]): number => {
  if (!moodHistory.length) return 0;
  
  // Ordenar por fecha descendente
  const sortedHistory = moodHistory
    .sort((a, b) => b.date.seconds - a.date.seconds);
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const entry of sortedHistory) {
    const entryDate = new Date(entry.date.seconds * 1000);
    entryDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Añade un post a destacados
 */
export const addToHighlights = async (userId: string, postId: string) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    highlights: arrayUnion(postId)
  });
};

/**
 * Remueve un post de destacados
 */
export const removeFromHighlights = async (userId: string, postId: string) => {
  const userRef = doc(db, 'users', userId);
  return updateDoc(userRef, {
    highlights: arrayRemove(postId)
  });
};

/**
 * Verifica si un usuario sigue a otro
 */
export const isFollowing = async (currentUserId: string, targetUserId: string): Promise<boolean> => {
  console.log('isFollowing llamado:', { currentUserId, targetUserId });
  const userProfile = await getUserProfile(currentUserId);
  const result = userProfile?.following?.includes(targetUserId) || false;
  console.log('isFollowing resultado:', { following: userProfile?.following, result });
  return result;
};

/**
 * Obtiene el historial de moods de un usuario
 * @param userId ID del usuario
 * @returns Array con el historial de moods
 */
export const getUserMoodHistory = async (userId: string) => {
  try {
    const userProfile = await getUserProfile(userId);
    return userProfile?.moodHistory || [];
  } catch (error) {
    console.error('Error al obtener historial de moods:', error);
    return [];
  }
};

/**
 * Registra un mood en el historial del usuario
 * @param userId ID del usuario
 * @param mood ID del mood
 */
export const recordMoodHistory = async (userId: string, mood: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    
    // Obtener historial actual
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const currentHistory = userData?.moodHistory || [];
    
    // Verificar si ya hay un registro para hoy
    const todayEntry = currentHistory.find((entry: any) => {
      const entryDate = entry.date?.seconds ? new Date(entry.date.seconds * 1000) : new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    if (todayEntry) {
      // Actualizar mood de hoy
      const updatedHistory = currentHistory.map((entry: any) => {
        const entryDate = entry.date?.seconds ? new Date(entry.date.seconds * 1000) : new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        if (entryDate.getTime() === today.getTime()) {
          return { ...entry, mood };
        }
        return entry;
      });
      
      await updateDoc(userRef, {
        moodHistory: updatedHistory,
        currentMood: mood
      });
    } else {
      // Agregar nuevo registro
      const newEntry = {
        date: serverTimestamp(),
        mood
      };
      
      await updateDoc(userRef, {
        moodHistory: arrayUnion(newEntry),
        currentMood: mood
      });
    }
  } catch (error) {
    console.error('Error al registrar mood:', error);
    throw error;
  }
};
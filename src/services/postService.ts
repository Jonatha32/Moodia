import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Post } from '../types';

const postsCollectionRef = collection(db, 'posts');

export const createPost = (postData: Omit<Post, 'createdAt' | 'id'>) => {
  // Usamos Omit para no tener que pasar 'createdAt' desde el formulario
  return addDoc(postsCollectionRef, {
    ...postData,
    createdAt: serverTimestamp(), // Firebase se encarga de poner la fecha y hora del servidor
  });
};

/**
 * Escucha los posts en tiempo real, opcionalmente filtrados por mood.
 * @param callback Función que se ejecuta cada vez que los datos cambian.
 * @param mood El mood por el cual filtrar los posts.
 * @returns Una función para cancelar la suscripción.
 */
export const getPosts = (callback: (posts: Post[]) => void, mood?: string) => {
  const q = mood
    ? query(postsCollectionRef, where('mood', '==', mood), orderBy('createdAt', 'desc'))
    : query(postsCollectionRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post));
    callback(posts);
  });

  return unsubscribe;
};

/**
 * Escucha los posts de un usuario específico en tiempo real.
 * @param userId El ID del usuario.
 * @param callback Función que se ejecuta cada vez que los datos cambian.
 * @returns Una función para cancelar la suscripción.
 */
export const getPostsByUserId = (userId: string, callback: (posts: Post[]) => void) => {
  const q = query(postsCollectionRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post));
    callback(posts);
  });

  return unsubscribe;
};

/**
 * Añade o quita una reacción de un usuario a un post.
 * @param postId El ID del post.
 * @param reactionType El tipo de reacción (ej. 'love', 'support').
 * @param userId El ID del usuario que reacciona.
 */
export const toggleReaction = async (postId: string, reactionType: string, userId: string) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  const postData = postSnap.data() as Post | undefined;
  const hasReacted = postData?.reactions?.[reactionType]?.includes(userId);

  const updatePayload = {
    [`reactions.${reactionType}`]: hasReacted ? arrayRemove(userId) : arrayUnion(userId),
  };

  return updateDoc(postRef, updatePayload);
};

/**
 * Marca o desmarca un post como destacado.
 * @param postId El ID del post.
 * @param isHighlighted Si el post debe estar destacado o no.
 */
export const toggleHighlightPost = async (postId: string, isHighlighted: boolean) => {
  const postRef = doc(db, 'posts', postId);
  return updateDoc(postRef, { isHighlighted });
};

/**
 * Obtiene los posts destacados de un usuario.
 * @param userId El ID del usuario.
 * @param callback Función que se ejecuta cada vez que los datos cambian.
 * @returns Una función para cancelar la suscripción.
 */
export const getHighlightedPostsByUserId = (userId: string, callback: (posts: Post[]) => void) => {
  const q = query(
    postsCollectionRef, 
    where('userId', '==', userId), 
    where('isHighlighted', '==', true),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Post));
    callback(posts);
  });

  return unsubscribe;
};

/**
 * Agrega un comentario a un post
 */
export const addComment = async (postId: string, userId: string, text: string) => {
  const commentData = {
    postId,
    userId,
    text,
    createdAt: serverTimestamp()
  };
  
  const commentRef = await addDoc(collection(db, 'comments'), commentData);
  
  // Actualizar contador de comentarios
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  const currentCount = postSnap.data()?.commentsCount || 0;
  await updateDoc(postRef, { commentsCount: currentCount + 1 });
  
  return commentRef;
};

/**
 * Obtiene comentarios de un post
 */
export const getPostComments = (postId: string, callback: (comments: any[]) => void) => {
  const q = query(
    collection(db, 'comments'),
    where('postId', '==', postId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
};
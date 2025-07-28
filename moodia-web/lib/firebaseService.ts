'use client';

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { db, storage, auth } from './firebase';
import { Post, User, Mood } from '@/types';

// Auth Services
export const authService = {
  async register(email: string, password: string, name: string, avatar?: File) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    let avatarUrl = '';
    if (avatar) {
      avatarUrl = await uploadFile(avatar, `avatars/${user.uid}`);
    }
    
    await updateProfile(user, { displayName: name, photoURL: avatarUrl });
    
    const userData = {
      uid: user.uid,
      name,
      email,
      avatar: avatarUrl,
      bio: '',
      followers: [],
      following: [],
      postsCount: 0,
      createdAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'users'), userData);
    return userData;
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async logout() {
    await signOut(auth);
  },

  async getCurrentUser() {
    return auth.currentUser;
  }
};

// User Services
export const userService = {
  async getUserProfile(uid: string) {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs[0]?.data();
  },

  async updateProfile(uid: string, data: Partial<User>) {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(snapshot.docs[0].ref, data);
    }
  },

  async followUser(currentUid: string, targetUid: string) {
    const currentUserQuery = query(collection(db, 'users'), where('uid', '==', currentUid));
    const targetUserQuery = query(collection(db, 'users'), where('uid', '==', targetUid));
    
    const [currentSnapshot, targetSnapshot] = await Promise.all([
      getDocs(currentUserQuery),
      getDocs(targetUserQuery)
    ]);
    
    if (!currentSnapshot.empty && !targetSnapshot.empty) {
      await Promise.all([
        updateDoc(currentSnapshot.docs[0].ref, {
          following: arrayUnion(targetUid)
        }),
        updateDoc(targetSnapshot.docs[0].ref, {
          followers: arrayUnion(currentUid)
        })
      ]);
    }
  }
};

// Post Services
export const postService = {
  async createPost(postData: {
    title: string;
    description: string;
    mood: Mood;
    context?: string;
    image?: File;
  }) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    let imageUrl = '';
    if (postData.image) {
      imageUrl = await uploadFile(postData.image, `posts/${user.uid}/${Date.now()}`);
    }

    const post = {
      userId: user.uid,
      userName: user.displayName || 'Usuario',
      userAvatar: user.photoURL || '',
      title: postData.title,
      description: postData.description,
      mood: postData.mood,
      context: postData.context || '',
      imageUrl,
      reactions: {
        loved: [],
        mindblown: [],
        cracked: [],
        touched: [],
        fire: [],
        uplifted: []
      },
      comments: [],
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts'), post);
    
    // Update user posts count
    const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
      await updateDoc(userSnapshot.docs[0].ref, {
        postsCount: increment(1)
      });
    }

    return { id: docRef.id, ...post };
  },

  async getPosts(moodFilter?: Mood, limitCount = 20) {
    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (moodFilter) {
      q = query(
        collection(db, 'posts'),
        where('mood', '==', moodFilter),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getUserPosts(uid: string) {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async reactToPost(postId: string, reactionType: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const reactions = postData.reactions || {};
      
      // Remove user from all reaction arrays first
      const updates: any = {};
      Object.keys(reactions).forEach(reaction => {
        updates[`reactions.${reaction}`] = arrayRemove(user.uid);
      });
      
      // Add user to the selected reaction
      updates[`reactions.${reactionType}`] = arrayUnion(user.uid);
      
      await updateDoc(postRef, updates);
    }
  },

  async deletePost(postId: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists() && postDoc.data().userId === user.uid) {
      // Delete image if exists
      if (postDoc.data().imageUrl) {
        const imageRef = ref(storage, postDoc.data().imageUrl);
        await deleteObject(imageRef).catch(console.error);
      }
      
      await deleteDoc(postRef);
      
      // Update user posts count
      const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        await updateDoc(userSnapshot.docs[0].ref, {
          postsCount: increment(-1)
        });
      }
    }
  }
};

// Story Services
export const storyService = {
  async createStory(storyData: {
    image: File;
    mood: Mood;
    text?: string;
  }) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const imageUrl = await uploadFile(storyData.image, `stories/${user.uid}/${Date.now()}`);
    
    const story = {
      userId: user.uid,
      userName: user.displayName || 'Usuario',
      userAvatar: user.photoURL || '',
      imageUrl,
      mood: storyData.mood,
      text: storyData.text || '',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const docRef = await addDoc(collection(db, 'stories'), story);
    return { id: docRef.id, ...story };
  },

  async getActiveStories() {
    const now = new Date();
    const q = query(
      collection(db, 'stories'),
      where('expiresAt', '>', now),
      orderBy('expiresAt'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getUserStories(uid: string) {
    const now = new Date();
    const q = query(
      collection(db, 'stories'),
      where('userId', '==', uid),
      where('expiresAt', '>', now),
      orderBy('expiresAt'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

// Mood Services
export const moodService = {
  async setUserMood(mood: Mood) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const today = new Date().toDateString();
    const moodData = {
      userId: user.uid,
      mood,
      date: today,
      timestamp: serverTimestamp()
    };

    // Use user ID + date as document ID to ensure one mood per day
    const docId = `${user.uid}_${today}`;
    await updateDoc(doc(db, 'moods', docId), moodData).catch(async () => {
      // If document doesn't exist, create it
      await addDoc(collection(db, 'moods'), { ...moodData, id: docId });
    });

    return moodData;
  },

  async getUserMood(uid: string, date?: string) {
    const targetDate = date || new Date().toDateString();
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', uid),
      where('date', '==', targetDate)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs[0]?.data();
  }
};

// File Upload Helper
async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
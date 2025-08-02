import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
}

export interface Post {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  mood: string;
  userId: string;
  imageUrl?: string;
  imagePublicId?: string; // ID para poder borrarla de Cloudinary
  createdAt: Timestamp;
  reactions?: {
    [key:string]: string[]; // e.g., { love: ['uid1', 'uid2'], support: ['uid3'] }
  };
}
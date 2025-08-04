import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  username?: string;
  bio?: string;
  location?: string;
  currentMood?: string;
  followers?: string[];
  following?: string[];
  badges?: string[];
  moodHistory?: MoodHistoryEntry[];
  highlights?: string[]; // Post IDs
  activeDays?: number;
}

export interface MoodHistoryEntry {
  date: Timestamp;
  mood: string;
}

export interface UserStats {
  totalPosts: number;
  followers: number;
  following: number;
  streakDays: number;
  moodCounts: Record<string, number>;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
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
  isHighlighted?: boolean; // Para posts destacados
  reactions?: {
    [key:string]: string[]; // e.g., { love: ['uid1', 'uid2'], support: ['uid3'] }
  };
  commentsCount?: number;
}
export type Mood = 'focus' | 'creative' | 'explorer' | 'reflective' | 'chill' | 'relax' | 'motivated';

export type Reaction = 'love' | 'support' | 'helpful' | 'inspiring' | 'learned' | 'share';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoriteMood: Mood;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  mood: Mood;
  imageUrl?: string;
  context?: string;
  reactions: Record<Reaction, string[]>;
  createdAt: Date;
}

export interface UserProfile extends User {
  posts: Post[];
  savedPosts: string[];
  reactionStats: Record<Reaction, number>;
}
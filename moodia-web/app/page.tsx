'use client';

import { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import MoodSelector from '@/components/MoodSelector';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { Mood, Post, Reaction } from '@/types';

// Mock data para el MVP
const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Ana García',
    title: 'Aprendiendo React Native',
    description: 'Hoy empecé mi primer proyecto en React Native. Es desafiante pero emocionante ver cómo cobra vida la app.',
    mood: 'focus',
    context: 'Quiero documentar mi proceso de aprendizaje para inspirar a otros',
    reactions: {
      love: ['user2'],
      support: ['user2', 'user3'],
      helpful: [],
      inspiring: ['user3'],
      learned: [],
      share: [],
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Carlos López',
    title: 'Sesión de pintura matutina',
    description: 'Desperté con ganas de crear algo nuevo. Los colores de hoy reflejan mi estado de ánimo optimista.',
    mood: 'creative',
    reactions: {
      love: ['user1', 'user3'],
      support: [],
      helpful: [],
      inspiring: ['user1'],
      learned: [],
      share: ['user1'],
    },
    createdAt: new Date('2024-01-14'),
  },
];

export default function Home() {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentUserId] = useState('user1'); // Mock user ID

  const filteredPosts = currentMood 
    ? posts.filter(post => post.mood === currentMood)
    : posts;

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
  };

  const handleCreatePost = (postData: {
    title: string;
    description: string;
    mood: Mood;
    context?: string;
    image?: File;
  }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: 'Usuario Actual',
      title: postData.title,
      description: postData.description,
      mood: postData.mood,
      context: postData.context,
      reactions: {
        love: [],
        support: [],
        helpful: [],
        inspiring: [],
        learned: [],
        share: [],
      },
      createdAt: new Date(),
    };

    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  const handleReaction = (postId: string, reaction: Reaction) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const userReactions = post.reactions[reaction] || [];
        const hasReacted = userReactions.includes(currentUserId);
        
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reaction]: hasReacted
              ? userReactions.filter(id => id !== currentUserId)
              : [...userReactions, currentUserId]
          }
        };
      }
      return post;
    }));
  };

  const handleSave = (postId: string) => {
    // Implementar lógica de guardado
    console.log('Guardando post:', postId);
  };

  if (!currentMood) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-light sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/WhatsApp Image 2025-07-25 at 16.45-Photoroom.png" 
                alt="Moodia" 
                className="h-8"
              />
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-neutral-dark">Mood actual:</span>
              <span className="capitalize font-semibold text-neutral-navy bg-neutral-light px-3 py-1 rounded-full">{currentMood}</span>
              <button
                onClick={() => setCurrentMood(null)}
                className="text-primary-purple hover:text-primary-pink font-medium transition-colors"
              >
                Cambiar
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreatePost(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar</span>
            </button>
            <button className="p-2 hover:bg-neutral-light rounded-full transition-colors">
              <User className="w-5 h-5 text-neutral-dark" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌟</div>
            <p className="text-neutral-dark mb-4 text-lg">
              No hay publicaciones para tu mood actual
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="text-primary-purple hover:text-primary-pink font-semibold text-lg transition-colors"
            >
              ¡Sé el primero en compartir!
            </button>
          </div>
        ) : (
          <div>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onReaction={handleReaction}
                onSave={handleSave}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Post Modal */}
      {showCreatePost && currentMood && (
        <CreatePost
          currentMood={currentMood}
          onSubmit={handleCreatePost}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMood } from '@/contexts/MoodContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MoodSelector from '@/components/MoodSelector';
import Feed from '@/components/Feed';
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

function HomeContent() {
  const { user, userProfile, logout } = useAuth();
  const { currentMood, loading: moodLoading } = useMood();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const currentUserId = user?.uid || 'user1';

  useEffect(() => {
    // Si no hay mood seleccionado, redirigir al onboarding
    if (!moodLoading && !currentMood) {
      router.push('/onboarding');
    }
  }, [currentMood, moodLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('moodSelectedDate');
      localStorage.removeItem('currentMood');
      router.push('/auth');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const filteredPosts = currentMood 
    ? posts.filter(post => post.mood === currentMood)
    : posts;

  const handleMoodSelect = (mood: Mood) => {
    // El mood ya se maneja en el MoodContext
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
      userName: userProfile?.name || user?.displayName || 'Usuario',
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

  if (moodLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium">Cargando tu mood...</span>
          </div>
        </div>
      </div>
    );
  }

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
                onClick={() => router.push('/onboarding')}
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
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden md:block">
                Hola, {userProfile?.name || user?.displayName || 'Usuario'}
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Feed 
        posts={posts}
        onReaction={handleReaction}
        onSave={handleSave}
        currentUserId={currentUserId}
      />

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

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
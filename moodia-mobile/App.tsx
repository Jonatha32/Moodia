import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { MoodProvider, useMood } from './src/contexts/MoodContext';
import Login from './src/components/auth/Login';
import Signup from './src/components/auth/Signup';
import MoodSelectorNew from './src/components/MoodSelectorNew';
import Feed from './src/components/Feed';
import { Mood, Post, Reaction } from './src/types';

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

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { currentMood, loading: moodLoading } = useMood();
  const [isLogin, setIsLogin] = useState(true);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const currentUserId = user?.uid || 'user1';

  const handleMoodSelect = (mood: Mood) => {
    // El mood ya se maneja en el MoodContext
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
    console.log('Guardando post:', postId);
  };

  if (authLoading || moodLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Cargando Moodia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Signup onToggleMode={() => setIsLogin(true)} />
        )}
      </SafeAreaView>
    );
  }

  if (!currentMood) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <MoodSelectorNew onMoodSelect={handleMoodSelect} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Feed 
        posts={posts}
        onReaction={handleReaction}
        onSave={handleSave}
        currentUserId={currentUserId}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <AppContent />
      </MoodProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#7B5BFF',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});
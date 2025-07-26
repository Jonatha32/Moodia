import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MoodSelector from './src/components/MoodSelector';
import PostCard from './src/components/PostCard';
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

export default function App() {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [currentUserId] = useState('user1'); // Mock user ID

  const filteredPosts = currentMood 
    ? posts.filter(post => post.mood === currentMood)
    : posts;

  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
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

  if (!currentMood) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Moodia</Text>
        <View style={styles.moodInfo}>
          <Text style={styles.moodLabel}>Mood actual: </Text>
          <Text style={styles.moodValue}>{currentMood}</Text>
          <TouchableOpacity onPress={() => setCurrentMood(null)}>
            <Text style={styles.changeButton}>Cambiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🌟</Text>
            <Text style={styles.emptyText}>
              No hay publicaciones para tu mood actual
            </Text>
            <Text style={styles.emptySubtext}>
              ¡Sé el primero en compartir!
            </Text>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onReaction={handleReaction}
              onSave={handleSave}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E2F',
    marginBottom: 8,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 14,
    color: '#4A4A6A',
  },
  moodValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E2F',
    textTransform: 'capitalize',
    marginRight: 12,
    backgroundColor: '#F0F0F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeButton: {
    fontSize: 14,
    color: '#7B5BFF',
    fontWeight: '600',
  },
  feed: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#4A4A6A',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#7B5BFF',
    fontWeight: '600',
  },
});
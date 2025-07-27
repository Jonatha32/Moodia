import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMood } from '../contexts/MoodContext';
import { useAuth } from '../contexts/AuthContext';
import { Post, Reaction, Mood } from '../types';

interface FeedProps {
  posts: Post[];
  onReaction: (postId: string, reaction: Reaction) => void;
  onSave: (postId: string) => void;
  currentUserId: string;
}

const reactionIcons = {
  love: { icon: '❤️', label: 'Me encanta', color: '#FF6B6B' },
  support: { icon: '🙌', label: 'Apoyo esto', color: '#00C897' },
  helpful: { icon: '🎯', label: 'Me aporta', color: '#3A86FF' },
  inspiring: { icon: '🧠', label: 'Me inspira', color: '#9B5DE5' },
  learned: { icon: '📚', label: 'Aprendí algo', color: '#FF5E9C' },
  share: { icon: '🔁', label: 'Quiero compartir', color: '#70D6FF' }
};

const moodColors = {
  focus: '#3A86FF',
  creative: '#FF5E9C',
  explorer: '#00C897',
  reflective: '#9B5DE5',
  chill: '#70D6FF',
  relax: '#D3D3E7',
  motivated: '#FF6B6B'
};

const moodEmojis = {
  focus: '🎯',
  creative: '🌈',
  explorer: '🔍',
  reflective: '💭',
  chill: '😎',
  relax: '😴',
  motivated: '🔥'
};

const { width } = Dimensions.get('window');

export default function Feed({ posts, onReaction, onSave, currentUserId }: FeedProps) {
  const { currentMood, getMoodColor } = useMood();
  const { userProfile } = useAuth();
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = currentMood 
    ? posts.filter(post => post.mood === currentMood)
    : posts;

  const getReactionCount = (post: Post, reaction: Reaction) => {
    return post.reactions[reaction]?.length || 0;
  };

  const hasUserReacted = (post: Post, reaction: Reaction) => {
    return post.reactions[reaction]?.includes(currentUserId) || false;
  };

  const handleReaction = (postId: string, reaction: Reaction) => {
    onReaction(postId, reaction);
  };

  if (filteredPosts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🌟</Text>
        <Text style={styles.emptyTitle}>No hay publicaciones para tu mood</Text>
        <Text style={styles.emptySubtitle}>¡Sé el primero en compartir algo {currentMood}!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Mood Header */}
      <View style={styles.moodHeader}>
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
          style={styles.moodHeaderGradient}
        >
          <View style={styles.moodInfo}>
            <Text style={styles.greeting}>
              Hola, {userProfile?.name || 'Usuario'} 👋
            </Text>
            {currentMood && (
              <View style={[styles.moodBadge, { backgroundColor: `${getMoodColor(currentMood)}20` }]}>
                <Text style={styles.moodEmoji}>{moodEmojis[currentMood]}</Text>
                <View>
                  <Text style={[styles.moodText, { color: getMoodColor(currentMood) }]}>
                    Mood: {currentMood}
                  </Text>
                  <Text style={styles.moodSubtext}>Activo hoy</Text>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Posts Grid */}
      <View style={styles.postsContainer}>
        {filteredPosts.map((post, index) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <LinearGradient
                  colors={['#7B5BFF', '#FF5E9C']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {post.userName.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{post.userName}</Text>
                  <Text style={styles.postDate}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              {/* Mood Badge */}
              <View style={[
                styles.postMoodBadge,
                { backgroundColor: `${moodColors[post.mood]}20` }
              ]}>
                <Text style={styles.postMoodEmoji}>{moodEmojis[post.mood]}</Text>
                <Text style={[styles.postMoodText, { color: moodColors[post.mood] }]}>
                  {post.mood}
                </Text>
              </View>
            </View>

            {/* Post Content */}
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title}</Text>
              
              <Text style={styles.postDescription}>
                {expandedPost === post.id 
                  ? post.description 
                  : post.description.length > 150 
                    ? `${post.description.substring(0, 150)}...`
                    : post.description
                }
              </Text>

              {post.description.length > 150 && (
                <TouchableOpacity
                  onPress={() => setExpandedPost(
                    expandedPost === post.id ? null : post.id
                  )}
                >
                  <Text style={styles.readMore}>
                    {expandedPost === post.id ? 'Ver menos' : 'Ver más'}
                  </Text>
                </TouchableOpacity>
              )}

              {post.context && (
                <View style={styles.contextContainer}>
                  <Text style={styles.contextText}>"{post.context}"</Text>
                </View>
              )}
            </View>

            {/* Post Image */}
            {post.imageUrl && (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            )}

            {/* Reactions */}
            <View style={styles.reactionsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.reactionsList}>
                  {Object.entries(reactionIcons).map(([key, { icon, label, color }]) => {
                    const reaction = key as Reaction;
                    const count = getReactionCount(post, reaction);
                    const hasReacted = hasUserReacted(post, reaction);
                    
                    return (
                      <TouchableOpacity
                        key={reaction}
                        style={[
                          styles.reactionButton,
                          hasReacted && { backgroundColor: color + '20', borderColor: color }
                        ]}
                        onPress={() => handleReaction(post.id, reaction)}
                      >
                        <Text style={styles.reactionIcon}>{icon}</Text>
                        {count > 0 && (
                          <Text style={[
                            styles.reactionCount,
                            hasReacted && { color: color }
                          ]}>
                            {count}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>Comentar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={20} color="#6B7280" />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => onSave(post.id)}
              >
                <Ionicons name="bookmark-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  moodHeader: {
    marginBottom: 20,
  },
  moodHeaderGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  moodInfo: {
    gap: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  moodSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  postsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  postDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  postMoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  postMoodEmoji: {
    fontSize: 16,
  },
  postMoodText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  postContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  postDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  readMore: {
    fontSize: 14,
    color: '#7B5BFF',
    fontWeight: '600',
  },
  contextContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  contextText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  reactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  reactionsList: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  reactionIcon: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  saveButton: {
    padding: 8,
  },
});
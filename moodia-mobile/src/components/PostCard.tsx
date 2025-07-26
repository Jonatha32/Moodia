import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Post, Reaction } from '../types';

const reactionEmojis: Record<Reaction, string> = {
  love: '❤️',
  support: '🙌',
  helpful: '🎯',
  inspiring: '🧠',
  learned: '📚',
  share: '🔁',
};

const moodEmojis = {
  focus: '🎯',
  creative: '🌈',
  explorer: '🔍',
  reflective: '💭',
  chill: '😎',
  relax: '😴',
  motivated: '🔥',
};

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onReaction: (postId: string, reaction: Reaction) => void;
  onSave: (postId: string) => void;
}

export default function PostCard({ post, currentUserId, onReaction, onSave }: PostCardProps) {
  return (
    <View style={styles.container}>
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.userName[0]}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{post.userName}</Text>
              <View style={styles.moodContainer}>
                <Text style={styles.moodEmoji}>{moodEmojis[post.mood]}</Text>
                <Text style={styles.moodText}>{post.mood}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
        
        {post.context && (
          <View style={styles.contextContainer}>
            <Text style={styles.contextText}>"{post.context}"</Text>
          </View>
        )}

        <View style={styles.reactions}>
          {Object.entries(reactionEmojis).map(([reaction, emoji]) => {
            const count = post.reactions[reaction as Reaction]?.length || 0;
            const hasReacted = post.reactions[reaction as Reaction]?.includes(currentUserId);
            
            return (
              <TouchableOpacity
                key={reaction}
                style={[
                  styles.reactionButton,
                  hasReacted && styles.reactionButtonActive,
                ]}
                onPress={() => onReaction(post.id, reaction as Reaction)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                {count > 0 && <Text style={styles.reactionCount}>{count}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSave(post.id)}
        >
          <Text style={styles.saveText}>📌 Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7B5BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E2F',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  moodEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  moodText: {
    fontSize: 12,
    color: '#4A4A6A',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E2F',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  contextContainer: {
    backgroundColor: '#F0F0F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7B5BFF',
  },
  contextText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  reactionButtonActive: {
    backgroundColor: '#7B5BFF',
    shadowColor: '#7B5BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    alignSelf: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  saveText: {
    fontSize: 14,
    color: '#4A4A6A',
    fontWeight: '500',
  },
});
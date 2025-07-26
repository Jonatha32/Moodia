'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Star, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import { useAuth } from '@/contexts/AuthContext';
import { Post, Reaction, Mood } from '@/types';

interface FeedProps {
  posts: Post[];
  onReaction: (postId: string, reaction: Reaction) => void;
  onSave: (postId: string) => void;
  currentUserId: string;
}

const reactionIcons = {
  love: { icon: Heart, label: 'Me encanta', color: '#FF6B6B' },
  support: { icon: '🙌', label: 'Apoyo esto', color: '#00C897' },
  helpful: { icon: '🎯', label: 'Me aporta', color: '#3A86FF' },
  inspiring: { icon: '🧠', label: 'Me inspira', color: '#9B5DE5' },
  learned: { icon: '📚', label: 'Aprendí algo', color: '#FF5E9C' },
  share: { icon: Share2, label: 'Quiero compartir', color: '#70D6FF' }
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

export default function Feed({ posts, onReaction, onSave, currentUserId }: FeedProps) {
  const { currentMood, getMoodColor, canChangeMood } = useMood();
  const { userProfile } = useAuth();
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = currentMood 
    ? posts.filter(post => post.mood === currentMood)
    : posts;

  const handleReaction = (postId: string, reaction: Reaction) => {
    onReaction(postId, reaction);
  };

  const getReactionCount = (post: Post, reaction: Reaction) => {
    return post.reactions[reaction]?.length || 0;
  };

  const hasUserReacted = (post: Post, reaction: Reaction) => {
    return post.reactions[reaction]?.includes(currentUserId) || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-white to-neutral-light">
      {/* Mood Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-light">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-neutral-navy">
                Hola, {userProfile?.name || 'Usuario'} 👋
              </h1>
            </div>
            
            {currentMood && (
              <motion.button
                onClick={() => setShowMoodSelector(!showMoodSelector)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all"
                style={{ 
                  borderColor: getMoodColor(currentMood),
                  backgroundColor: `${getMoodColor(currentMood)}10`
                }}
              >
                <span className="text-2xl">{moodEmojis[currentMood]}</span>
                <div className="text-left">
                  <div className="font-semibold text-neutral-navy capitalize">
                    Mood: {currentMood}
                  </div>
                  <div className="text-sm text-neutral-dark">
                    {canChangeMood ? 'Toca para cambiar' : 'Activo hoy'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-dark" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🌟</div>
            <h2 className="text-3xl font-bold text-neutral-navy mb-4">
              No hay publicaciones para tu mood
            </h2>
            <p className="text-neutral-dark text-lg mb-8">
              ¡Sé el primero en compartir algo {currentMood}!
            </p>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid mb-6"
              >
                <div className="bg-white rounded-3xl shadow-sm border border-neutral-light overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-bold">
                            {post.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-navy">
                            {post.userName}
                          </div>
                          <div className="text-sm text-neutral-dark">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mood Badge */}
                      <div 
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                        style={{ 
                          backgroundColor: `${moodColors[post.mood]}20`,
                          color: moodColors[post.mood]
                        }}
                      >
                        <span>{moodEmojis[post.mood]}</span>
                        <span className="capitalize">{post.mood}</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-xl font-bold text-neutral-navy mb-3">
                      {post.title}
                    </h3>
                    
                    <p className="text-neutral-dark leading-relaxed mb-4">
                      {expandedPost === post.id 
                        ? post.description 
                        : post.description.length > 150 
                          ? `${post.description.substring(0, 150)}...`
                          : post.description
                      }
                    </p>

                    {post.description.length > 150 && (
                      <button
                        onClick={() => setExpandedPost(
                          expandedPost === post.id ? null : post.id
                        )}
                        className="text-primary-purple font-medium text-sm hover:text-primary-pink transition-colors"
                      >
                        {expandedPost === post.id ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}

                    {post.context && (
                      <div className="mt-4 p-4 bg-neutral-light rounded-2xl">
                        <div className="text-sm text-neutral-dark italic">
                          "{post.context}"
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="px-6 pb-4">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full rounded-2xl object-cover"
                      />
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(reactionIcons).map(([key, { icon: Icon, label, color }]) => {
                        const reaction = key as Reaction;
                        const count = getReactionCount(post, reaction);
                        const hasReacted = hasUserReacted(post, reaction);
                        
                        return (
                          <motion.button
                            key={reaction}
                            onClick={() => handleReaction(post.id, reaction)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                              hasReacted
                                ? 'text-white shadow-md'
                                : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
                            }`}
                            style={hasReacted ? { backgroundColor: color } : {}}
                          >
                            {typeof Icon === 'string' ? (
                              <span>{Icon}</span>
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                            {count > 0 && <span>{count}</span>}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-light">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-neutral-dark hover:text-primary-purple transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">Comentar</span>
                        </button>
                        <button className="flex items-center gap-2 text-neutral-dark hover:text-primary-purple transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">Compartir</span>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => onSave(post.id)}
                        className="p-2 text-neutral-dark hover:text-primary-purple transition-colors"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
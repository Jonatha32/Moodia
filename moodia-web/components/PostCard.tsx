'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Target, Brain, BookOpen, Share2, Bookmark } from 'lucide-react';
import { Post, Reaction } from '@/types';

const reactionIcons: Record<Reaction, { icon: React.ReactNode; label: string }> = {
  love: { icon: <Heart className="w-4 h-4" />, label: 'Me encanta' },
  support: { icon: <Users className="w-4 h-4" />, label: 'Apoyo esto' },
  helpful: { icon: <Target className="w-4 h-4" />, label: 'Me aporta' },
  inspiring: { icon: <Brain className="w-4 h-4" />, label: 'Me inspira' },
  learned: { icon: <BookOpen className="w-4 h-4" />, label: 'Aprendí algo' },
  share: { icon: <Share2 className="w-4 h-4" />, label: 'Quiero compartir' },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mood-card overflow-hidden mb-6"
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              {post.userAvatar ? (
                <img src={post.userAvatar} alt={post.userName} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-sm font-semibold text-white">{post.userName[0]}</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-neutral-navy">{post.userName}</p>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-lg">{moodEmojis[post.mood]}</span>
                <span className="capitalize text-neutral-dark font-medium">{post.mood}</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-neutral-navy mb-3">{post.title}</h3>
        <p className="text-neutral-dark mb-4 leading-relaxed">{post.description}</p>
        
        {post.context && (
          <div className="bg-neutral-light rounded-xl p-4 mb-4 border-l-4 border-primary-purple">
            <p className="text-sm text-neutral-dark italic">"{post.context}"</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(reactionIcons).map(([reaction, { icon, label }]) => {
            const count = post.reactions[reaction as Reaction]?.length || 0;
            const hasReacted = post.reactions[reaction as Reaction]?.includes(currentUserId);
            
            return (
              <motion.button
                key={reaction}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReaction(post.id, reaction as Reaction)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  hasReacted
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium hover:shadow-sm'
                }`}
              >
                {icon}
                <span>{count > 0 && count}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-light">
          <button
            onClick={() => onSave(post.id)}
            className="flex items-center space-x-2 text-neutral-dark hover:text-primary-purple transition-colors font-medium"
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-sm">Guardar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
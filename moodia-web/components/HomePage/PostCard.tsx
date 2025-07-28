'use client';

import { motion } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { postService } from '@/lib/firebaseService';
import { Post, Reaction } from '@/types';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
}

const reactionEmojis: Record<Reaction, string> = {
  love: '❤️',
  support: '🙌',
  helpful: '🎯',
  inspiring: '🧠',
  learned: '📚',
  share: '🔁'
};

const reactionLabels: Record<Reaction, string> = {
  love: 'Me encanta',
  support: 'Apoyo esto',
  helpful: 'Me aporta',
  inspiring: 'Me inspira',
  learned: 'Aprendí algo',
  share: 'Quiero compartir'
};

export default function PostCard({ post }: PostCardProps) {
  const { getMoodColor } = useMood();
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [liked, setLiked] = useState(false);

  const moodColor = getMoodColor(post.mood);

  const handleReaction = async (reaction: Reaction) => {
    try {
      await postService.reactToPost(post.id, reaction);
      setSelectedReaction(selectedReaction === reaction ? null : reaction);
      setShowReactions(false);
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  const getTotalReactions = () => {
    return Object.values(post.reactions).reduce((total, users) => total + users.length, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* User Header */}
      <div className="flex items-center p-4 pb-3">
        <div className="relative">
          <img
            src={post.userAvatar || `https://ui-avatars.com/api/?name=${post.userName}&background=random`}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-xs"
            style={{ backgroundColor: moodColor }}
          >
            {post.mood === 'focus' && '🎯'}
            {post.mood === 'creative' && '🌈'}
            {post.mood === 'explorer' && '🔍'}
            {post.mood === 'reflective' && '💭'}
            {post.mood === 'chill' && '😎'}
            {post.mood === 'relax' && '😴'}
            {post.mood === 'motivated' && '🔥'}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{post.userName}</h4>
          <p className="text-xs text-gray-500">
            {post.createdAt.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="relative overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full aspect-square object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-base text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.description}</p>
        
        {/* Context */}
        {post.context && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-3 mb-4 border-l-4" style={{ borderColor: moodColor }}>
            <p className="text-xs text-gray-500 mb-1">"¿Por qué comparto esto?"</p>
            <p className="text-sm text-gray-700 italic">{post.context}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-1"
            >
              <svg 
                className={`w-6 h-6 transition-colors ${
                  liked ? 'text-red-500 fill-current' : 'text-gray-600'
                }`} 
                fill={liked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.371l-6.674 2.223a.75.75 0 01-.945-.945l2.223-6.674A8.013 8.013 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </motion.button>
        </div>

        {/* Likes and Reactions */}
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">{getTotalReactions() + (liked ? 1 : 0)} reacciones</span>
        </div>

        {/* Emotional Reactions */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowReactions(!showReactions)}
          className="w-full text-left text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Reaccionar emocionalmente...
        </motion.button>

        {/* Reaction Selector */}
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-gray-50 rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(reactionEmojis).map(([reaction, emoji]) => (
                <motion.button
                  key={reaction}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(reaction as Reaction)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-sm transition-all ${
                    selectedReaction === reaction
                      ? 'bg-white shadow-sm border-2'
                      : 'hover:bg-white/70'
                  }`}
                  style={{
                    borderColor: selectedReaction === reaction ? moodColor : 'transparent'
                  }}
                >
                  <span className="text-base">{emoji}</span>
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {reactionLabels[reaction as Reaction]}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
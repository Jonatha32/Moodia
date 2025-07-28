'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { Post, Reaction } from '@/types';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import MoodiaReactions from './MoodiaReactions';

interface TikTokPostProps {
  post: Post;
  isActive: boolean;
  index: number;
  total: number;
}

export default function TikTokPost({ post, isActive, index, total }: TikTokPostProps) {
  const { getMoodColor } = useMood();
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const moodColor = getMoodColor(post.mood);

  const getTotalReactions = () => {
    return Object.values(post.reactions).reduce((total, users) => total + users.length, 0);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const mockStats = {
    likes: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 500) + 10,
    shares: Math.floor(Math.random() * 200) + 5
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative w-full max-w-md mx-auto h-full flex flex-col"
    >
      {/* Main Content */}
      <div className="flex-1 relative bg-black/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20">
        {/* Image/Video */}
        <div className="relative h-2/3 overflow-hidden">
          <motion.img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Mood Badge */}
          <div 
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold backdrop-blur-md border border-white/30"
            style={{ backgroundColor: `${moodColor}80` }}
          >
            {post.mood === 'focus' && '🎯 Focus'}
            {post.mood === 'creative' && '🌈 Creativo'}
            {post.mood === 'explorer' && '🔍 Explorador'}
            {post.mood === 'reflective' && '💭 Reflexivo'}
            {post.mood === 'chill' && '😎 Chill'}
            {post.mood === 'relax' && '😴 Relax'}
            {post.mood === 'motivated' && '🔥 Motivado'}
          </div>

          {/* User Info Overlay */}
          <div className="absolute bottom-4 left-4 right-20">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-12 h-12 rounded-full border-2 border-white/50"
              />
              <div>
                <h3 className="text-white font-bold text-lg">{post.userName}</h3>
                <p className="text-white/80 text-sm">
                  {post.createdAt.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="h-1/3 p-6 bg-white/95 backdrop-blur-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3">
            {post.description}
          </p>
          
          {post.context && (
            <div 
              className="p-3 rounded-2xl mb-3 border-l-4"
              style={{ 
                backgroundColor: `${moodColor}10`,
                borderColor: moodColor
              }}
            >
              <p className="text-xs text-gray-500 mb-1">"¿Por qué comparto esto?"</p>
              <p className="text-sm text-gray-700 italic line-clamp-2">{post.context}</p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>{formatNumber(mockStats.likes + getTotalReactions())} reacciones</span>
            <span>{formatNumber(mockStats.comments)} comentarios</span>
            <span>{formatNumber(mockStats.shares)} compartidos</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-4">
        {/* Reactions */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setShowReactions(true)}
            onHoverEnd={() => setShowReactions(false)}
            onClick={() => setShowReactions(!showReactions)}
            className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
          >
            <Heart className={`w-7 h-7 ${liked ? 'text-red-500 fill-current' : 'text-white'}`} />
          </motion.button>
          <div className="text-white text-xs text-center mt-1 font-medium">
            {formatNumber(mockStats.likes + getTotalReactions())}
          </div>

          <AnimatePresence>
            {showReactions && (
              <MoodiaReactions
                onReactionSelect={(reaction) => {
                  setSelectedReaction(reaction);
                  setShowReactions(false);
                }}
                selectedReaction={selectedReaction}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Comments */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.button>
        <div className="text-white text-xs text-center mt-1 font-medium">
          {formatNumber(mockStats.comments)}
        </div>

        {/* Share */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
        >
          <Share className="w-7 h-7 text-white" />
        </motion.button>
        <div className="text-white text-xs text-center mt-1 font-medium">
          {formatNumber(mockStats.shares)}
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSaved(!saved)}
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
        >
          <Bookmark className={`w-7 h-7 ${saved ? 'text-yellow-400 fill-current' : 'text-white'}`} />
        </motion.button>

        {/* More */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
        >
          <MoreHorizontal className="w-7 h-7 text-white" />
        </motion.button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
          <span>{index + 1}</span>
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/60 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((index + 1) / total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span>{total}</span>
        </div>
      </div>
    </motion.div>
  );
}
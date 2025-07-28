'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { Post } from '@/types';
import { X, Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import MoodiaReactions from './HomePage/MoodiaReactions';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const { getMoodColor } = useMood();
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const mockStats = {
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
    shares: Math.floor(Math.random() * 50) + 5
  };

  const mockComments = [
    { user: 'Carlos López', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', comment: '¡Increíble proceso! Me inspira mucho tu dedicación 🔥', time: '2h' },
    { user: 'Sofía Chen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face', comment: 'Esto es exactamente lo que necesitaba leer hoy. Gracias por compartir 💖', time: '4h' },
    { user: 'Diego Martín', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', comment: 'Tu perspectiva siempre me hace reflexionar. Gracias por ser tan auténtica', time: '6h' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="w-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                <p className="text-sm text-gray-500">
                  {post.createdAt.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Post Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Mood Badge */}
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4"
                style={{ 
                  backgroundColor: `${getMoodColor(post.mood)}20`,
                  color: getMoodColor(post.mood)
                }}
              >
                {post.mood === 'focus' && '🎯 Focus'}
                {post.mood === 'creative' && '🌈 Creativo'}
                {post.mood === 'explorer' && '🔍 Explorador'}
                {post.mood === 'reflective' && '💭 Reflexivo'}
                {post.mood === 'chill' && '😎 Chill'}
                {post.mood === 'relax' && '😴 Relax'}
                {post.mood === 'motivated' && '🔥 Motivado'}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{post.description}</p>
              
              {post.context && (
                <div 
                  className="p-4 rounded-2xl mb-4 border-l-4"
                  style={{ 
                    backgroundColor: `${getMoodColor(post.mood)}10`,
                    borderColor: getMoodColor(post.mood)
                  }}
                >
                  <p className="text-sm text-gray-500 mb-1">"¿Por qué comparto esto?"</p>
                  <p className="text-gray-700 italic">{post.context}</p>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{mockStats.likes} reacciones</span>
                <span>{mockStats.comments} comentarios</span>
                <span>{mockStats.shares} compartidos</span>
              </div>
            </div>

            {/* Comments */}
            <div className="border-t border-gray-100">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Comentarios</h3>
                <div className="space-y-4">
                  {mockComments.map((comment, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.user}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl px-3 py-2">
                          <p className="font-semibold text-sm text-gray-900">{comment.user}</p>
                          <p className="text-sm text-gray-700">{comment.comment}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-3">{comment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Reactions */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onHoverStart={() => setShowReactions(true)}
                    onHoverEnd={() => setShowReactions(false)}
                    onClick={() => setShowReactions(!showReactions)}
                    className="flex items-center gap-1"
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </motion.button>

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

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  <Share className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark className={`w-6 h-6 ${saved ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreHorizontal className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Comment Input */}
            <div className="flex gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Tu+Usuario&background=random"
                alt="Tu avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  className="w-full px-4 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
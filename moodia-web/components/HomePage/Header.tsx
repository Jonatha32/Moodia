'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, MessageCircle, Bookmark, Star, User } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import MoodChanger from '../MoodChanger';

export default function Header() {
  const { currentMood, getMoodColor } = useMood();
  const [showMoodChanger, setShowMoodChanger] = useState(false);

  const moodEmojis = {
    focus: '🎯',
    creative: '🌈',
    explorer: '🔍',
    reflective: '💭',
    chill: '😎',
    relax: '😴',
    motivated: '🔥'
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-xl">M</span>
              </motion.div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Moodia
              </span>
            </div>

            {/* Current Mood */}
            {currentMood && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMoodChanger(true)}
                className="flex items-center space-x-3 px-4 py-2 rounded-2xl transition-all duration-300 shadow-sm border-2"
                style={{ 
                  backgroundColor: `${getMoodColor(currentMood)}15`,
                  borderColor: `${getMoodColor(currentMood)}30`
                }}
              >
                <span className="text-2xl">{moodEmojis[currentMood]}</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {currentMood}
                  </p>
                  <p className="text-xs text-gray-500">Toca para cambiar</p>
                </div>
              </motion.button>
            )}

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar en Moodia..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-200 relative"
              >
                <Bell className="w-5 h-5" />
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-200"
              >
                <Bookmark className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-200"
              >
                <Star className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mood Changer Modal */}
      <AnimatePresence>
        {showMoodChanger && (
          <MoodChanger onClose={() => setShowMoodChanger(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
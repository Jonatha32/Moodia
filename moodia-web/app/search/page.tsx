'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users } from 'lucide-react';
import Header from '@/components/HomePage/Header';
import FooterNav from '@/components/HomePage/FooterNav';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const trendingTopics = [
    { tag: '#MindfulMorning', posts: '2.3K', mood: 'reflective' },
    { tag: '#CreativeFlow', posts: '1.8K', mood: 'creative' },
    { tag: '#FitnessJourney', posts: '3.1K', mood: 'motivated' },
    { tag: '#ChillVibes', posts: '1.2K', mood: 'chill' },
    { tag: '#ExploreMore', posts: '2.7K', mood: 'explorer' }
  ];

  const suggestedUsers = [
    { name: 'Ana García', username: '@ana_mindful', followers: '12.3K', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { name: 'Carlos López', username: '@carlos_creates', followers: '8.7K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: 'María Rodríguez', username: '@maria_codes', followers: '15.2K', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explorar Moodia
          </h1>
          <p className="text-gray-600 mb-6">
            Descubre procesos, personas y moods que te inspiren
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar procesos, usuarios, moods..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Tendencias</h2>
            </div>
            
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{topic.tag}</p>
                      <p className="text-sm text-gray-500">{topic.posts} publicaciones</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Suggested Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Usuarios sugeridos</h2>
            </div>
            
            <div className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <motion.div
                  key={user.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.followers} seguidores</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Seguir
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mood Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-3xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Explorar por Mood</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { mood: 'focus', emoji: '🎯', label: 'Focus', color: '#3A86FF' },
              { mood: 'creative', emoji: '🌈', label: 'Creativo', color: '#FF5E9C' },
              { mood: 'explorer', emoji: '🔍', label: 'Explorador', color: '#00C897' },
              { mood: 'reflective', emoji: '💭', label: 'Reflexivo', color: '#9B5DE5' },
              { mood: 'chill', emoji: '😎', label: 'Chill', color: '#70D6FF' },
              { mood: 'relax', emoji: '😴', label: 'Relax', color: '#D3D3E7' },
              { mood: 'motivated', emoji: '🔥', label: 'Motivado', color: '#FF6B6B' }
            ].map((mood, index) => (
              <motion.button
                key={mood.mood}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all text-center"
                style={{ 
                  backgroundColor: `${mood.color}10`,
                  borderColor: `${mood.color}30`
                }}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="font-semibold text-gray-800 text-sm">{mood.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.floor(Math.random() * 500) + 100} posts
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      <FooterNav />
    </div>
  );
}
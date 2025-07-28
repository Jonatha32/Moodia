'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useMood } from '@/contexts/MoodContext';
import { useMockData } from '@/hooks/useMockData';
import { Post } from '@/types';
import Header from '@/components/HomePage/Header';
import FooterNav from '@/components/HomePage/FooterNav';
import MoodChanger from '@/components/MoodChanger';
import PostModal from '@/components/PostModal';
import { Settings, Edit3, Plus, Grid3X3, Bookmark, Heart, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const { currentMood, getMoodColor } = useMood();
  const { getAllPosts, mockUsers } = useMockData();
  const [showMoodChanger, setShowMoodChanger] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'liked'>('posts');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const currentUser = mockUsers[0]; // Simulate current user
  const userPosts = getAllPosts().slice(0, 9); // Simulate user posts

  const moodEmojis = {
    focus: '🎯',
    creative: '🌈',
    explorer: '🔍',
    reflective: '💭',
    chill: '😎',
    relax: '😴',
    motivated: '🔥'
  };

  const stats = {
    posts: 127,
    followers: 1234,
    following: 567
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {currentMood && (
                <div 
                  className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: getMoodColor(currentMood) }}
                >
                  {moodEmojis[currentMood]}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4 inline mr-2" />
                    Editar perfil
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.posts}</div>
                  <div className="text-sm text-gray-600">publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.followers}</div>
                  <div className="text-sm text-gray-600">seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.following}</div>
                  <div className="text-sm text-gray-600">siguiendo</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mb-4 max-w-md">
                ✨ Compartiendo mi journey de crecimiento personal<br/>
                📚 Amante de los libros y la meditación<br/>
                🎯 Enfocada en vivir conscientemente
              </p>

              {/* Current Mood */}
              {currentMood && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMoodChanger(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all"
                  style={{ 
                    backgroundColor: `${getMoodColor(currentMood)}15`,
                    borderColor: `${getMoodColor(currentMood)}30`
                  }}
                >
                  <span className="text-xl">{moodEmojis[currentMood]}</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    Mood: {currentMood}
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Historias destacadas</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {/* Add Story */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-purple-400 transition-colors">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs text-gray-600">Nuevo</span>
            </motion.button>

            {/* Mock Stories */}
            {['Viajes', 'Fitness', 'Lectura', 'Arte'].map((story, index) => (
              <motion.button
                key={story}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-0.5">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">
                      {index === 0 && '✈️'}
                      {index === 1 && '💪'}
                      {index === 2 && '📚'}
                      {index === 3 && '🎨'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-600">{story}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'posts', label: 'Publicaciones', icon: Grid3X3 },
              { key: 'saved', label: 'Guardados', icon: Bookmark },
              { key: 'liked', label: 'Me gusta', icon: Heart }
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all ${
                  activeTab === key
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPost(post)}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="text-white text-center">
                        <div className="flex items-center justify-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 fill-current" />
                            <span className="text-sm font-semibold">
                              {Math.floor(Math.random() * 500) + 50}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {Math.floor(Math.random() * 50) + 5}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs font-medium truncate px-2">{post.title}</p>
                      </div>
                    </motion.div>
                    
                    {/* Mood indicator */}
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg"
                      style={{ backgroundColor: getMoodColor(post.mood) }}
                    >
                      {post.mood === 'focus' && '🎯'}
                      {post.mood === 'creative' && '🌈'}
                      {post.mood === 'explorer' && '🔍'}
                      {post.mood === 'reflective' && '💭'}
                      {post.mood === 'chill' && '😎'}
                      {post.mood === 'relax' && '😴'}
                      {post.mood === 'motivated' && '🔥'}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay publicaciones guardadas
                </h3>
                <p className="text-gray-500">
                  Las publicaciones que guardes aparecerán aquí
                </p>
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay publicaciones que te gusten
                </h3>
                <p className="text-gray-500">
                  Las publicaciones que te gusten aparecerán aquí
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterNav />

      {/* Modals */}
      <AnimatePresence>
        {showMoodChanger && (
          <MoodChanger onClose={() => setShowMoodChanger(false)} />
        )}
        {selectedPost && (
          <PostModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
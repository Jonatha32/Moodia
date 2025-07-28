'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMood } from '@/contexts/MoodContext';
import Header from '@/components/HomePage/Header';
import FooterNav from '@/components/HomePage/FooterNav';
import CreatePost from '@/components/CreatePost';

export default function CreatePage() {
  const router = useRouter();
  const { currentMood } = useMood();
  const [showCreatePost, setShowCreatePost] = useState(true);

  const handlePost = (post: any) => {
    // Simulate posting
    console.log('New post created:', post);
    router.push('/home');
  };

  const handleClose = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Crear nueva publicación
          </h1>
          <p className="text-gray-600 mb-8">
            Comparte tu proceso y conecta con otros desde tu mood actual
          </p>
          
          {currentMood && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2">Tu mood actual:</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg">
                <span className="text-2xl">
                  {currentMood === 'focus' && '🎯'}
                  {currentMood === 'creative' && '🌈'}
                  {currentMood === 'explorer' && '🔍'}
                  {currentMood === 'reflective' && '💭'}
                  {currentMood === 'chill' && '😎'}
                  {currentMood === 'relax' && '😴'}
                  {currentMood === 'motivated' && '🔥'}
                </span>
                <span className="font-semibold text-gray-800 capitalize">
                  {currentMood}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <FooterNav />

      {showCreatePost && (
        <CreatePost 
          onClose={handleClose}
          onPost={handlePost}
        />
      )}
    </div>
  );
}
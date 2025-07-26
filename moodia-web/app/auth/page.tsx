'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import LoadingScreen from '@/components/LoadingScreen';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      const moodSelectedDate = localStorage.getItem('moodSelectedDate');
      const today = new Date().toDateString();
      
      if (moodSelectedDate === today) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen message="Iniciando Moodia..." />;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <Login onToggleMode={() => setIsLogin(false)} />
          ) : (
            <Signup onToggleMode={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
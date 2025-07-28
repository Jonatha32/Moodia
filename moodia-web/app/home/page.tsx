'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMood } from '@/contexts/MoodContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/HomePage/Header';
import MoodBanner from '@/components/HomePage/MoodBanner';
import FeedGrid from '@/components/HomePage/FeedGrid';
import FooterNav from '@/components/HomePage/FooterNav';
import LoadingScreen from '@/components/LoadingScreen';
import AuthModal from '@/components/auth/AuthModal';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { currentMood, loading: moodLoading } = useMood();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    } else if (!moodLoading && user && !currentMood) {
      router.push('/onboarding');
    }
  }, [user, currentMood, authLoading, moodLoading, router]);

  if (authLoading || moodLoading) {
    return <LoadingScreen message="Cargando tu feed personalizado..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenido a Moodia</h1>
          <p className="text-gray-600 mb-8">La red social que humaniza la interacción digital</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Comenzar
          </button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (!currentMood) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <Header />
      
      {/* Mood Banner */}
      <MoodBanner />
      
      {/* Main Feed */}
      <main className="pb-20 md:pb-8">
        <FeedGrid />
      </main>
      
      {/* Mobile Navigation */}
      <FooterNav />
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
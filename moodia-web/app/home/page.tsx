'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useMood } from '@/contexts/MoodContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/HomePage/Header';
import MoodBanner from '@/components/HomePage/MoodBanner';
import FeedGrid from '@/components/HomePage/FeedGrid';
import FooterNav from '@/components/HomePage/FooterNav';
import LoadingScreen from '@/components/LoadingScreen';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { currentMood, loading: moodLoading } = useMood();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (!moodLoading && user && !currentMood) {
      router.push('/onboarding');
    }
  }, [user, currentMood, authLoading, moodLoading, router]);

  if (authLoading || moodLoading) {
    return <LoadingScreen message="Cargando tu feed personalizado..." />;
  }

  if (!user || !currentMood) {
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
    </div>
  );
}
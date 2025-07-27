'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DailyOnboarding from '@/components/auth/DailyOnboarding';
import LoadingScreen from '@/components/LoadingScreen';
import { Mood } from '@/types';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleMoodSelect = (mood: Mood) => {
    // El mood ya se guarda en el MoodContext, solo redirigir
    router.push('/home');
  };

  if (loading) {
    return <LoadingScreen message="Preparando tu experiencia..." />;
  }

  if (!user) {
    return null;
  }

  return <DailyOnboarding onMoodSelect={handleMoodSelect} />;
}
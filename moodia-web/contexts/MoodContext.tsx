'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { Mood } from '@/types';

interface MoodData {
  mood: Mood;
  selectedAt: Date;
  userId: string;
}

interface MoodContextType {
  currentMood: Mood | null;
  moodHistory: MoodData[];
  loading: boolean;
  selectMood: (mood: Mood) => Promise<void>;
  getMoodColor: (mood: Mood) => string;
  getMoodGradient: (mood: Mood) => string;
  canChangeMood: boolean;
  timeUntilNextMood: string;
}

const moodColors = {
  focus: '#3A86FF',
  creative: '#FF5E9C',
  explorer: '#00C897',
  reflective: '#9B5DE5',
  chill: '#70D6FF',
  relax: '#D3D3E7',
  motivated: '#FF6B6B'
};

const moodGradients = {
  focus: 'linear-gradient(135deg, #3A86FF 0%, #4F94FF 100%)',
  creative: 'linear-gradient(135deg, #FF5E9C 0%, #FF7AB8 100%)',
  explorer: 'linear-gradient(135deg, #00C897 0%, #00E5A8 100%)',
  reflective: 'linear-gradient(135deg, #9B5DE5 0%, #B478F0 100%)',
  chill: 'linear-gradient(135deg, #70D6FF 0%, #8DE0FF 100%)',
  relax: 'linear-gradient(135deg, #D3D3E7 0%, #E8E8F0 100%)',
  motivated: 'linear-gradient(135deg, #FF6B6B 0%, #FF8A8A 100%)'
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserMood();
    } else {
      setCurrentMood(null);
      setMoodHistory([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserMood = async () => {
    if (!user) return;

    try {
      const today = new Date().toDateString();
      const moodDoc = await getDoc(doc(db, 'userMoods', `${user.uid}_${today}`));
      
      if (moodDoc.exists()) {
        const data = moodDoc.data() as MoodData;
        setCurrentMood(data.mood);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading mood:', error);
      setLoading(false);
    }
  };

  const selectMood = async (mood: Mood) => {
    if (!user) return;

    try {
      const now = new Date();
      const today = now.toDateString();
      
      const moodData: MoodData = {
        mood,
        selectedAt: now,
        userId: user.uid
      };

      await setDoc(doc(db, 'userMoods', `${user.uid}_${today}`), moodData);
      
      setCurrentMood(mood);
      setMoodHistory(prev => [moodData, ...prev.slice(0, 6)]);
      
      // Guardar en localStorage para acceso rápido
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentMood', mood);
        localStorage.setItem('moodSelectedDate', today);
      }
      
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  };

  const getMoodColor = (mood: Mood) => moodColors[mood];
  const getMoodGradient = (mood: Mood) => moodGradients[mood];

  const canChangeMood = () => {
    // Permitir cambiar mood una vez por día
    if (typeof window === 'undefined') return true;
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('moodSelectedDate');
    return savedDate !== today;
  };

  const getTimeUntilNextMood = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const value = {
    currentMood,
    moodHistory,
    loading,
    selectMood,
    getMoodColor,
    getMoodGradient,
    canChangeMood: canChangeMood(),
    timeUntilNextMood: getTimeUntilNextMood()
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}
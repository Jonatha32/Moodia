import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { Mood } from '../types';

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
  canChangeMood: boolean;
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
      
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  };

  const getMoodColor = (mood: Mood) => moodColors[mood];

  const canChangeMood = () => {
    const today = new Date().toDateString();
    // En móvil permitimos cambiar mood una vez por día
    return true;
  };

  const value = {
    currentMood,
    moodHistory,
    loading,
    selectMood,
    getMoodColor,
    canChangeMood: canChangeMood()
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
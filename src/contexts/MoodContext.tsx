import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { recordMoodHistory } from '../services/userService';

interface MoodContextType {
  selectedMood: string | undefined;
  setMood: (mood: string | undefined) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood debe ser usado dentro de un MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const { currentUser } = useAuth();

  const setMood = async (mood: string | undefined) => {
    setSelectedMood(mood);
    
    // Registrar mood en el historial
    if (currentUser && mood) {
      try {
        await recordMoodHistory(currentUser.uid, mood);
      } catch (error) {
        console.error('Error al registrar mood:', error);
      }
    }
  };

  const value = { selectedMood, setMood };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const setMood = (mood: string | undefined) => {
    setSelectedMood(mood);
  };

  const value = { selectedMood, setMood };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
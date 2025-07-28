'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { Mood } from '@/types';

const moodOptions = [
  { mood: 'focus', emoji: '🎯', label: 'Focus', color: '#3A86FF' },
  { mood: 'creative', emoji: '🌈', label: 'Creativo', color: '#FF5E9C' },
  { mood: 'explorer', emoji: '🔍', label: 'Explorador', color: '#00C897' },
  { mood: 'reflective', emoji: '💭', label: 'Reflexivo', color: '#9B5DE5' },
  { mood: 'chill', emoji: '😎', label: 'Chill', color: '#70D6FF' },
  { mood: 'relax', emoji: '😴', label: 'Relax', color: '#D3D3E7' },
  { mood: 'motivated', emoji: '🔥', label: 'Motivado', color: '#FF6B6B' }
] as const;

interface MoodChangerProps {
  onClose?: () => void;
}

export default function MoodChanger({ onClose }: MoodChangerProps) {
  const { currentMood, selectMood, getMoodColor } = useMood();
  const [isChanging, setIsChanging] = useState(false);

  const handleMoodChange = async (newMood: Mood) => {
    if (newMood === currentMood) return;
    
    setIsChanging(true);
    try {
      await selectMood(newMood);
      setTimeout(() => {
        onClose?.();
      }, 1000);
    } catch (error) {
      console.error('Error changing mood:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cambiar Mood
          </h2>
          <p className="text-gray-600">
            ¿Cómo te sentís ahora?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {moodOptions.map((option) => (
            <motion.button
              key={option.mood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodChange(option.mood as Mood)}
              disabled={isChanging}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                currentMood === option.mood
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="font-semibold text-sm text-gray-900">
                {option.label}
              </div>
              {currentMood === option.mood && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2 w-2 h-2 bg-purple-500 rounded-full mx-auto"
                />
              )}
            </motion.button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-colors"
        >
          Cancelar
        </button>
      </motion.div>
    </motion.div>
  );
}
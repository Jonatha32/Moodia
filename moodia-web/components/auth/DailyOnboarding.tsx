'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mood } from '@/types';

interface DailyOnboardingProps {
  onMoodSelect: (mood: Mood) => void;
}

const moods = [
  { 
    id: 'focus' as Mood, 
    name: 'Focus', 
    emoji: '🎯', 
    color: '#3A86FF',
    description: 'Concentración y productividad'
  },
  { 
    id: 'creative' as Mood, 
    name: 'Creativo', 
    emoji: '🌈', 
    color: '#FF5E9C',
    description: 'Inspiración y creatividad'
  },
  { 
    id: 'explorer' as Mood, 
    name: 'Explorador', 
    emoji: '🔍', 
    color: '#00C897',
    description: 'Descubrimiento y aprendizaje'
  },
  { 
    id: 'reflective' as Mood, 
    name: 'Reflexivo', 
    emoji: '💭', 
    color: '#9B5DE5',
    description: 'Contemplación y análisis'
  },
  { 
    id: 'chill' as Mood, 
    name: 'Chill', 
    emoji: '😎', 
    color: '#70D6FF',
    description: 'Relajación y tranquilidad'
  },
  { 
    id: 'relax' as Mood, 
    name: 'Relax', 
    emoji: '😴', 
    color: '#D3D3E7',
    description: 'Descanso y pausa'
  },
  { 
    id: 'motivated' as Mood, 
    name: 'Motivado', 
    emoji: '🔥', 
    color: '#FF6B6B',
    description: 'Energía y determinación'
  }
];

export default function DailyOnboarding({ onMoodSelect }: DailyOnboardingProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setIsAnimating(true);
    
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('moodSelectedDate', new Date().toDateString());
        localStorage.setItem('currentMood', mood);
      }
      onMoodSelect(mood);
    }, 1000);
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">M</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            >
              {getCurrentGreeting()}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-600 mb-2"
            >
              ¿Cómo te sentís hoy?
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-gray-500 italic"
            >
              Tu mood define tu experiencia en Moodia
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={isAnimating}
                whileHover={{ scale: selectedMood === mood.id ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedMood === mood.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                } ${isAnimating && selectedMood !== mood.id ? 'opacity-50' : ''}`}
                style={{
                  borderColor: selectedMood === mood.id ? mood.color : undefined
                }}
              >
                <div className="text-center">
                  <div className="text-4xl md:text-5xl mb-3">{mood.emoji}</div>
                  <div className="font-semibold text-gray-800 mb-2">{mood.name}</div>
                  <div className="text-xs text-gray-500 leading-tight">{mood.description}</div>
                </div>

                {selectedMood === mood.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-2xl border-2 border-purple-500"
                    style={{ borderColor: mood.color }}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-2xl">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">¡Perfecto! Preparando tu experiencia...</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
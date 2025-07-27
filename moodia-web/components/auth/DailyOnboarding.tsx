'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
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
  const [backgroundGradient, setBackgroundGradient] = useState('from-purple-500 via-pink-500 to-orange-400');
  const { selectMood } = useMood();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoodSelect = async (mood: Mood) => {
    const selectedMoodData = moods.find(m => m.id === mood);
    if (!selectedMoodData) return;

    setSelectedMood(mood);
    setIsAnimating(true);
    
    // Cambiar gradiente de fondo
    const moodGradients = {
      focus: 'from-blue-600 via-indigo-500 to-purple-600',
      creative: 'from-pink-500 via-rose-400 to-orange-400',
      explorer: 'from-emerald-500 via-teal-400 to-cyan-400',
      reflective: 'from-purple-600 via-violet-500 to-indigo-500',
      chill: 'from-sky-400 via-cyan-400 to-blue-500',
      relax: 'from-slate-400 via-gray-400 to-zinc-400',
      motivated: 'from-red-500 via-orange-500 to-amber-400'
    };
    setBackgroundGradient(moodGradients[mood]);
    
    try {
      await selectMood(mood);
      setTimeout(() => {
        onMoodSelect(mood);
      }, 1500);
    } catch (error) {
      console.error('Error selecting mood:', error);
      setIsAnimating(false);
    }
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
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} flex items-center justify-center p-4 transition-all duration-1000 relative overflow-hidden`}>
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 md:p-16 shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-white/30">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="mb-8"
            >
              <img 
                src="/logo.png" 
                alt="Moodia Logo" 
                className="w-24 h-24 mx-auto drop-shadow-2xl"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6"
            >
              {getCurrentGreeting()}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
            >
              ¿Cómo te sentís hoy?
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Tu mood define tu experiencia. Elegí el que mejor represente tu energía de hoy ✨
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 md:gap-8">
            {moods.map((mood, index) => (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 1.1 + index * 0.15, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120
                }}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={isAnimating}
                whileHover={{ 
                  scale: selectedMood === mood.id ? 1.05 : 1.12,
                  y: selectedMood === mood.id ? 0 : -12,
                  rotateY: 5,
                  transition: { duration: 0.3, type: "spring" }
                }}
                whileTap={{ scale: 0.9 }}
                className={`relative p-6 md:p-8 rounded-[1.5rem] transition-all duration-700 group overflow-hidden ${
                  selectedMood === mood.id
                    ? 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] transform scale-105 ring-4 ring-white/50'
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)]'
                } ${isAnimating && selectedMood !== mood.id ? 'opacity-30 scale-95' : ''}`}
                style={{
                  background: selectedMood === mood.id 
                    ? `linear-gradient(135deg, ${mood.color}15 0%, white 30%, white 70%, ${mood.color}10 100%)`
                    : undefined
                }}
              >
                {/* Glow Effect */}
                <div 
                  className={`absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    selectedMood === mood.id ? 'opacity-100' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${mood.color}20 0%, transparent 50%, ${mood.color}10 100%)`,
                    boxShadow: selectedMood === mood.id ? `0 0 40px ${mood.color}30` : `0 0 20px ${mood.color}20`
                  }}
                />
                
                <div className="text-center relative z-10">
                  <div className={`text-6xl md:text-7xl mb-4 transform transition-all duration-500 group-hover:scale-125 filter drop-shadow-lg ${
                    selectedMood === mood.id ? 'scale-125 animate-bounce' : ''
                  }`}>
                    {mood.emoji}
                  </div>
                  <div className={`font-black text-xl md:text-2xl mb-3 transition-colors duration-300 ${
                    selectedMood === mood.id ? 'text-gray-800' : 'text-gray-700 group-hover:text-gray-800'
                  }`}>
                    {mood.name}
                  </div>
                  <div className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                    selectedMood === mood.id ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {mood.description}
                  </div>
                </div>

                {selectedMood === mood.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-20"
                    style={{
                      background: `linear-gradient(135deg, ${mood.color} 0%, ${mood.color}CC 100%)`,
                      boxShadow: `0 8px 24px ${mood.color}50`
                    }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
              className="text-center mt-16"
            >
              <div className="inline-flex items-center gap-6 bg-white/95 backdrop-blur-xl border-2 border-white/50 px-10 py-6 rounded-[1.5rem] shadow-[0_16px_32px_rgba(0,0,0,0.15)]">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${moods.find(m => m.id === selectedMood)?.color} 0%, ${moods.find(m => m.id === selectedMood)?.color}CC 100%)`,
                    boxShadow: `0 4px 16px ${moods.find(m => m.id === selectedMood)?.color}40`
                  }}
                >
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <div className="text-left">
                  <div className="text-2xl font-black text-gray-800 mb-1">
                    ¡Perfecto! 🎉
                  </div>
                  <div className="text-lg text-gray-600">
                    Preparando tu experiencia <span className="font-bold" style={{ color: moods.find(m => m.id === selectedMood)?.color }}>
                      {moods.find(m => m.id === selectedMood)?.name}
                    </span>...
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
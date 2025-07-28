'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { Mood } from '@/types';

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
  description: string;
  color: string;
  gradient: string;
}

const moodOptions: MoodOption[] = [
  { 
    mood: 'focus', 
    emoji: '🎯', 
    label: 'Focus', 
    description: 'Concentración y productividad',
    color: '#3A86FF',
    gradient: 'linear-gradient(135deg, #3A86FF 0%, #4F94FF 100%)'
  },
  { 
    mood: 'creative', 
    emoji: '🌈', 
    label: 'Creativo', 
    description: 'Inspiración y creatividad',
    color: '#FF5E9C',
    gradient: 'linear-gradient(135deg, #FF5E9C 0%, #FF7AB8 100%)'
  },
  { 
    mood: 'explorer', 
    emoji: '🔍', 
    label: 'Explorador', 
    description: 'Descubrimiento y aprendizaje',
    color: '#00C897',
    gradient: 'linear-gradient(135deg, #00C897 0%, #00E5A8 100%)'
  },
  { 
    mood: 'reflective', 
    emoji: '💭', 
    label: 'Reflexivo', 
    description: 'Contemplación y análisis',
    color: '#9B5DE5',
    gradient: 'linear-gradient(135deg, #9B5DE5 0%, #B478F0 100%)'
  },
  { 
    mood: 'chill', 
    emoji: '😎', 
    label: 'Chill', 
    description: 'Relajación y tranquilidad',
    color: '#70D6FF',
    gradient: 'linear-gradient(135deg, #70D6FF 0%, #8DE0FF 100%)'
  },
  { 
    mood: 'relax', 
    emoji: '😴', 
    label: 'Relax', 
    description: 'Descanso y pausa',
    color: '#D3D3E7',
    gradient: 'linear-gradient(135deg, #D3D3E7 0%, #E8E8F0 100%)'
  },
  { 
    mood: 'motivated', 
    emoji: '🔥', 
    label: 'Motivado', 
    description: 'Energía y determinación',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8A8A 100%)'
  }
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

export default function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(135deg, #7B5BFF 0%, #FF5E9C 50%, #FFAB5E 100%)');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMood, setHoveredMood] = useState<Mood | null>(null);
  const { selectMood } = useMood();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const handleMoodSelect = async (mood: Mood) => {
    const selectedOption = moodOptions.find(option => option.mood === mood);
    if (!selectedOption) return;

    setSelectedMood(mood);
    setBackgroundGradient(selectedOption.gradient);
    setIsAnimating(true);

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
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-1000"
      style={{ background: backgroundGradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-5xl w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-sans">
            {getCurrentGreeting()}
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-white/90 mb-6">
            ¿Cómo te sentís hoy?
          </h2>
          
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Tu mood define tu experiencia. Elegí el que mejor represente tu energía de hoy.
          </p>
        </motion.div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-6">
          {moodOptions.map((option, index) => (
            <motion.button
              key={option.mood}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.4 + index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: selectedMood === option.mood ? 1 : 1.12,
                y: -12,
                rotateY: 5,
                transition: { duration: 0.3, type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.92 }}
              onHoverStart={() => setHoveredMood(option.mood)}
              onHoverEnd={() => setHoveredMood(null)}
              onClick={() => handleMoodSelect(option.mood)}
              disabled={isAnimating}
              className={`relative group p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl transition-all duration-500 cursor-pointer ${
                selectedMood === option.mood
                  ? 'bg-white/40 backdrop-blur-lg border-2 border-white/60 shadow-2xl'
                  : 'bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50'
              } ${isAnimating && selectedMood !== option.mood ? 'opacity-40' : ''}`}
            >
              {/* Emoji */}
              <motion.div 
                className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4"
                animate={{
                  scale: hoveredMood === option.mood ? 1.2 : 1,
                  rotate: hoveredMood === option.mood ? [0, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {option.emoji}
              </motion.div>
              
              {/* Label */}
              <motion.div 
                className="font-bold text-white text-base md:text-lg lg:text-xl mb-2"
                animate={{
                  color: hoveredMood === option.mood ? '#ffffff' : 'rgba(255,255,255,0.9)'
                }}
              >
                {option.label}
              </motion.div>
              
              {/* Description */}
              <motion.div 
                className="text-white/70 text-xs md:text-sm leading-tight text-center"
                animate={{
                  opacity: hoveredMood === option.mood ? 1 : 0.7
                }}
              >
                {option.description}
              </motion.div>

              {/* Selection Indicator */}
              <AnimatePresence>
                {selectedMood === option.mood && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glow Effect */}
              {(selectedMood === option.mood || hoveredMood === option.mood) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: selectedMood === option.mood ? 0.8 : 0.4, 
                    scale: 1 
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 rounded-2xl md:rounded-3xl -z-10"
                  style={{
                    background: `radial-gradient(circle at center, ${option.color}30 0%, ${option.color}10 70%, transparent 100%)`,
                    boxShadow: `0 0 40px ${option.color}50, inset 0 0 20px ${option.color}20`
                  }}
                />
              )}
              
              {/* Pulse Animation for Selected */}
              {selectedMood === option.mood && (
                <motion.div
                  className="absolute inset-0 rounded-2xl md:rounded-3xl border-2"
                  style={{ borderColor: option.color }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Confirmation Message */}
        <AnimatePresence>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center mt-12"
            >
              <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">
                  ¡Perfecto! Preparando tu experiencia {moodOptions.find(m => m.mood === selectedMood)?.label}...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
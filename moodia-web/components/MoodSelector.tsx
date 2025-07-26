'use client';

import { motion } from 'framer-motion';
import { Mood } from '@/types';

interface MoodOption {
  mood: Mood;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

const moodOptions: MoodOption[] = [
  { mood: 'focus', emoji: '🎯', label: 'Focus', color: 'text-mood-focus', bgColor: 'bg-mood-focus/10 border-mood-focus' },
  { mood: 'creative', emoji: '🌈', label: 'Creativo', color: 'text-mood-creative', bgColor: 'bg-mood-creative/10 border-mood-creative' },
  { mood: 'explorer', emoji: '🔍', label: 'Explorador', color: 'text-mood-explorer', bgColor: 'bg-mood-explorer/10 border-mood-explorer' },
  { mood: 'reflective', emoji: '💭', label: 'Reflexivo', color: 'text-mood-reflective', bgColor: 'bg-mood-reflective/10 border-mood-reflective' },
  { mood: 'chill', emoji: '😎', label: 'Chill', color: 'text-mood-chill', bgColor: 'bg-mood-chill/10 border-mood-chill' },
  { mood: 'relax', emoji: '😴', label: 'Relax', color: 'text-mood-relax', bgColor: 'bg-mood-relax/10 border-mood-relax' },
  { mood: 'motivated', emoji: '🔥', label: 'Motivado', color: 'text-mood-motivated', bgColor: 'bg-mood-motivated/10 border-mood-motivated' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  selectedMood?: Mood;
}

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <img 
            src="/WhatsApp Image 2025-07-25 at 16.45-Photoroom.png" 
            alt="Moodia" 
            className="h-16 mx-auto mb-6"
          />
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Cómo te sentís hoy?
          </h2>
          <p className="text-white/80 text-lg">
            Elegí tu mood y descubrí contenido que resuene contigo
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moodOptions.map((option) => (
            <motion.button
              key={option.mood}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(option.mood)}
              className={`mood-card p-6 border-2 transition-all duration-300 ${
                selectedMood === option.mood
                  ? option.bgColor
                  : 'border-neutral-light hover:border-neutral-medium hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-3">{option.emoji}</div>
              <div className={`font-semibold ${
                selectedMood === option.mood ? option.color : 'text-neutral-dark'
              }`}>
                {option.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
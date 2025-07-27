'use client';

import { useMood } from '@/contexts/MoodContext';

const moodEmojis = {
  focus: '🎯',
  creative: '🌈',
  explorer: '🔍',
  reflective: '💭',
  chill: '😎',
  relax: '😴',
  motivated: '🔥'
};

const moodColors = {
  focus: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  creative: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  explorer: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  reflective: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  chill: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  relax: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  motivated: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
};

export default function MoodBanner() {
  const { currentMood } = useMood();

  if (!currentMood) return null;

  const colors = moodColors[currentMood];

  return (
    <div className={`${colors.bg} ${colors.border} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-3 px-4 py-2 ${colors.bg} ${colors.border} border rounded-full`}>
              <span className="text-2xl">{moodEmojis[currentMood]}</span>
              <div>
                <span className={`${colors.text} font-semibold capitalize`}>
                  Mood: {currentMood}
                </span>
                <p className="text-sm text-gray-600">Tu energía de hoy</p>
              </div>
            </div>
            <div className={`${colors.text} text-sm`}>
              Viendo contenido que resuena con tu mood actual
            </div>
          </div>
          
          <button 
            className={`px-4 py-2 ${colors.text} hover:bg-white/50 border ${colors.border} rounded-full transition-all duration-200 font-medium`}
            disabled
          >
            Cambiar Mood
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { moods } from '../config/moods';

const MoodChanger: React.FC = () => {
  const { selectedMood, setMood } = useMood();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentMood = moods.find(m => m.id === selectedMood);

  const handleMoodChange = (moodId: string) => {
    setMood(moodId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-sm border-2 transition-all duration-300 hover:scale-105 ${
          currentMood 
            ? `${currentMood.color} text-white border-transparent ${currentMood.shadow}` 
            : 'bg-white text-neutral-text border-gray-200 hover:border-primary-purple'
        }`}
      >
        <span className="text-2xl">{currentMood?.emoji || '🎭'}</span>
        <div className="text-left">
          <p className="font-poppins font-semibold text-sm">
            {currentMood ? currentMood.name : 'Seleccionar Mood'}
          </p>
          <p className="text-xs opacity-80">Cambiar estado</p>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 min-w-[300px]">
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodChange(mood.id)}
                className={`${mood.color} text-white p-4 rounded-xl hover:scale-105 transition-all duration-200 flex flex-col items-center gap-2 ${mood.shadow}`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="font-poppins font-medium text-sm">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodChanger;
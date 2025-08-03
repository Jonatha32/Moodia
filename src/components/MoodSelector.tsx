import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { moods } from '../config/moods';

const MoodSelector: React.FC = () => {
  const { selectedMood, setMood } = useMood();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentMood = moods.find(m => m.id === selectedMood);

  const handleMoodChange = (moodId: string) => {
    setMood(moodId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          currentMood 
            ? `${currentMood.color} ${currentMood.shadow}` 
            : 'bg-gradient-to-r from-primary-purple to-primary-coral shadow-primary'
        }`}
      >
        <span className="text-2xl">{currentMood?.emoji || '🎭'}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 min-w-[200px]">
          <div className="grid grid-cols-2 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodChange(mood.id)}
                className={`${mood.color} text-white p-3 rounded-xl hover:scale-105 transition-all duration-200 flex flex-col items-center gap-1 ${mood.shadow}`}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="font-poppins font-medium text-xs">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
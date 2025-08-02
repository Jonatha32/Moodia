import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../contexts/MoodContext';
import { moods } from '../config/moods';

const MoodSelectorPage: React.FC = () => {
  const { setMood } = useMood();
  const navigate = useNavigate();
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);

  const handleSelectMood = (moodId: string) => {
    setSelectedMoodId(moodId);
    setMood(moodId);
    
    // Pequeña animación antes de navegar
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-bg p-6">
      <img src="/logo.png" alt="Moodia Logo" className="w-24 h-24 mx-auto mb-8 animate-bounce" />
      {/* Título principal */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-poppins font-bold text-neutral-text mb-6 animate-fade-in">
          How are you feeling today?
        </h1>
        <p className="text-xl text-neutral-secondary font-lato font-light">
          Your mood will shape your Moodia experience
        </p>
      </div>

      {/* Grid de moods */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mb-12">
        {moods.map((mood, index) => (
          <button
            key={mood.id}
            onClick={() => handleSelectMood(mood.id)}
            className={`${mood.color} ${mood.shadow} text-white p-10 rounded-full hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-center aspect-square group relative overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
            
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {mood.emoji}
            </div>
            <div className="font-poppins font-semibold text-lg relative z-10">
              {mood.name}
            </div>
          </button>
        ))}
      </div>

      {/* Footer con toque personal */}
      <div className="text-center mt-8">
        <p className="text-neutral-secondary font-lato font-light text-sm">
          Made with 💜 from Uruguay
        </p>
      </div>
    </div>
  );
};

export default MoodSelectorPage;
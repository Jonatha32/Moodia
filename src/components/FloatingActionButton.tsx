import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { moods } from '../config/moods';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const { selectedMood } = useMood();
  const currentMood = moods.find(m => m.id === selectedMood);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Botón principal */}
      <button
        onClick={onClick}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 group relative overflow-hidden ${
          currentMood 
            ? `${currentMood.color} ${currentMood.shadow} focus:ring-opacity-50` 
            : 'gradient-primary shadow-primary focus:ring-primary-purple'
        }`}
        aria-label="Crear nuevo post"
      >
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        
        {/* Ícono animado */}
        <svg 
          className="w-8 h-8 transform group-hover:rotate-90 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Indicador de mood */}
      {currentMood && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
          <span className="text-sm">{currentMood.emoji}</span>
        </div>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-neutral-dark text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-lato">
        Compartir tu {currentMood?.name.toLowerCase() || 'mood'}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-dark"></div>
      </div>
    </div>
  );
};

export default FloatingActionButton;
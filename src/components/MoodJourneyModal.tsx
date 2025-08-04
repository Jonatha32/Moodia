import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { moods } from '../config/moods';
import { getUserMoodHistory } from '../services/userService';

interface MoodJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const MoodJourneyModal: React.FC<MoodJourneyModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile 
}) => {
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userProfile) {
      const fetchMoodHistory = async () => {
        setLoading(true);
        try {
          const history = await getUserMoodHistory(userProfile.uid);
          setMoodHistory(history);
        } catch (error) {
          console.error('Error al cargar historial de moods:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchMoodHistory();
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-secondary font-lato">Cargando tu mood journey...</p>
        </div>
      </div>
    );
  }

  const last30Days = moodHistory.slice(-30);

  // Crear calendario de los últimos 30 días
  const today = new Date();
  const calendar = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayEntry = last30Days.find(entry => {
      const entryDate = entry.date?.seconds ? new Date(entry.date.seconds * 1000) : new Date(entry.date);
      return entryDate.toDateString() === date.toDateString();
    });

    calendar.push({
      date,
      mood: dayEntry?.mood,
      day: date.getDate(),
      isToday: date.toDateString() === today.toDateString()
    });
  }

  // Estadísticas de moods
  const moodStats = moodHistory.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = moodHistory.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="gradient-primary p-6 border-b border-gray-100">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📊</span>
              <div>
                <h2 className="text-2xl font-poppins font-bold">Mood Journey</h2>
                <p className="text-sm opacity-90 font-lato">Tu viaje emocional en Moodia</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Calendario de Moods */}
          <div>
            <h3 className="text-xl font-poppins font-bold text-neutral-text mb-4">
              📅 Últimos 30 días
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="text-center text-xs font-lato font-medium text-neutral-secondary p-2">
                  {day}
                </div>
              ))}
              {calendar.map((day, index) => {
                const dayMood = day.mood ? moods.find(m => m.id === day.mood) : null;
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-montserrat font-semibold transition-all duration-200 hover:scale-110 ${
                      day.isToday 
                        ? 'ring-2 ring-primary-purple ring-offset-2' 
                        : ''
                    } ${
                      dayMood 
                        ? `${dayMood.color} text-white ${dayMood.shadow}` 
                        : 'bg-gray-100 text-neutral-secondary'
                    }`}
                    title={`${day.date.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} - ${dayMood?.name || 'Sin mood'}`}
                  >
                    {dayMood ? dayMood.emoji : day.day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estadísticas de Moods */}
          <div>
            <h3 className="text-xl font-poppins font-bold text-neutral-text mb-4">
              📈 Estadísticas de Moods
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(moodStats)
                .sort(([,a], [,b]) => b - a)
                .map(([moodId, count]) => {
                  const mood = moods.find(m => m.id === moodId);
                  if (!mood) return null;
                  const percentage = Math.round((count / totalEntries) * 100);
                  
                  return (
                    <div key={moodId} className={`${mood.color} text-white p-4 rounded-xl ${mood.shadow}`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <div className="font-montserrat font-bold text-lg">{count}</div>
                        <div className="text-xs opacity-90 font-lato">{mood.name}</div>
                        <div className="text-xs opacity-75 mt-1">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="text-xl font-poppins font-bold text-neutral-text mb-4">
              💡 Insights
            </h3>
            <div className="bg-gradient-to-r from-primary-purple to-primary-coral p-6 rounded-xl text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-montserrat font-bold">{totalEntries}</div>
                  <div className="text-sm opacity-90 font-lato">Total de registros</div>
                </div>
                <div>
                  <div className="text-2xl font-montserrat font-bold">
                    {Object.keys(moodStats).length}
                  </div>
                  <div className="text-sm opacity-90 font-lato">Moods diferentes</div>
                </div>
                <div>
                  <div className="text-2xl font-montserrat font-bold">
                    {Object.entries(moodStats).sort(([,a], [,b]) => b - a)[0]?.[0] 
                      ? moods.find(m => m.id === Object.entries(moodStats).sort(([,a], [,b]) => b - a)[0][0])?.emoji 
                      : '🎭'}
                  </div>
                  <div className="text-sm opacity-90 font-lato">Mood favorito</div>
                </div>
                <div>
                  <div className="text-2xl font-montserrat font-bold">
                    {last30Days.length > 0 ? Math.round((last30Days.length / 30) * 100) : 0}%
                  </div>
                  <div className="text-sm opacity-90 font-lato">Consistencia (30d)</div>
                </div>
              </div>
              
              {/* Mensaje motivacional */}
              <div className="mt-6 pt-6 border-t border-white border-opacity-20 text-center">
                <p className="font-lato text-sm opacity-90">
                  {totalEntries === 0 
                    ? '¡Comienza tu journey! Cada mood cuenta tu historia 🌟'
                    : totalEntries < 7
                    ? '¡Genial inicio! Sigue registrando tus moods 🚀'
                    : totalEntries < 30
                    ? '¡Vas muy bien! Tu journey está tomando forma 🌈'
                    : '¡Increíble! Eres un verdadero mood tracker 🏆'
                  }
                </p>
              </div>
            </div>
          </div>
          
          {/* Consejos personalizados */}
          {totalEntries > 7 && (
            <div>
              <h3 className="text-xl font-poppins font-bold text-neutral-text mb-4">
                🎯 Tu patrón emocional
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {(() => {
                        const topMood = Object.entries(moodStats).sort(([,a], [,b]) => b - a)[0];
                        return topMood ? moods.find(m => m.id === topMood[0])?.emoji : '🎭';
                      })()}
                    </div>
                    <p className="text-sm text-neutral-text font-lato">
                      <strong>Mood dominante:</strong><br/>
                      {(() => {
                        const topMood = Object.entries(moodStats).sort(([,a], [,b]) => b - a)[0];
                        return topMood ? moods.find(m => m.id === topMood[0])?.name : 'Ninguno';
                      })()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <p className="text-sm text-neutral-text font-lato">
                      <strong>Variedad emocional:</strong><br/>
                      {Object.keys(moodStats).length > 5 ? 'Alta diversidad' : 
                       Object.keys(moodStats).length > 3 ? 'Buena variedad' : 'Poca variedad'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodJourneyModal;
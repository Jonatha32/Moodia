import React, { useState } from 'react';
import { UserProfile } from '../types';
import { updateUserProfile } from '../services/userService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onProfileUpdated 
}) => {
  const [displayName, setDisplayName] = useState(userProfile.displayName || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedData = {
        displayName,
        bio,
        location,
        username: displayName.toLowerCase().replace(/\s+/g, '')
      };

      await updateUserProfile(userProfile.uid, updatedData);
      
      // Actualizar el perfil local
      const updatedProfile = { ...userProfile, ...updatedData };
      onProfileUpdated(updatedProfile);
      onClose();
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="gradient-primary p-6 border-b border-gray-100">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✏️</span>
              <div>
                <h2 className="text-2xl font-poppins font-bold">Editar Perfil</h2>
                <p className="text-sm opacity-90 font-lato">Actualiza tu información</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-lato">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-2">
              Bio (máx. 150 caracteres)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
            <div className="text-xs text-neutral-secondary mt-1 text-right">
              {bio.length}/150
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-2">
              Ubicación
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="Ciudad, País"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-100 text-neutral-text rounded-xl font-poppins font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="flex-1 py-3 px-6 gradient-primary text-white rounded-xl font-poppins font-semibold hover:scale-105 transition-transform duration-200 shadow-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
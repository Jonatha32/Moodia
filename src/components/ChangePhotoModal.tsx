import React, { useState } from 'react';
import { uploadProfileImageToCloudinary } from '../services/imageService';
import { updateUserProfile } from '../services/userService';
import { UserProfile } from '../types';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onPhotoUpdated: (photoURL: string) => void;
}

const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onPhotoUpdated 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      const photoURL = await uploadProfileImageToCloudinary(selectedFile);
      await updateUserProfile(userProfile.uid, { photoURL });
      onPhotoUpdated(photoURL);
      onClose();
    } catch (err) {
      setError('Error al subir la imagen');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="gradient-primary p-6 border-b border-gray-100">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📸</span>
              <div>
                <h2 className="text-2xl font-poppins font-bold">Cambiar Foto</h2>
                <p className="text-sm opacity-90 font-lato">Actualiza tu avatar</p>
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
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-lato">
              {error}
            </div>
          )}

          {/* Current Photo */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img
                src={preview || userProfile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.displayName}`}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-primary-purple border-opacity-50"
              />
            </div>
          </div>

          {/* File Input */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-purple transition-colors">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-neutral-secondary font-lato">
                {selectedFile ? selectedFile.name : 'Selecciona una imagen'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gray-100 text-neutral-text rounded-xl font-poppins font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex-1 py-3 px-6 gradient-primary text-white rounded-xl font-poppins font-semibold hover:scale-105 transition-transform duration-200 shadow-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {uploading ? 'Subiendo...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePhotoModal;
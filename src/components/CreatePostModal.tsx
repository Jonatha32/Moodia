import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import { createPost } from '../services/postService';
import { uploadImageToCloudinary } from '../services/imageService';
import { moods } from '../config/moods';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { selectedMood } = useMood();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postMood, setPostMood] = useState(selectedMood || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const selectedMoodObj = moods.find(m => m.id === postMood);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !postMood || !currentUser) return;

    setIsUploading(true);
    setError('');

    try {
      let imageUrl = '';
      if (imageFile) {
        setUploadProgress('Subiendo imagen...');
        imageUrl = await uploadImageToCloudinary(imageFile);
        setUploadProgress('Imagen subida ✓');
      }

      setUploadProgress('Creando post...');
      await createPost({
        title,
        description,
        mood: postMood,
        userId: currentUser.uid,
        imageUrl: imageUrl || undefined,
      });

      setUploadProgress('¡Post creado exitosamente! 🎉');
      
      // Reset form
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setUploadProgress('');
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error al crear post:', err);
      setError('Error al crear el post. Verifica tu conexión e intenta de nuevo.');
      setUploadProgress('');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className={`p-6 border-b border-gray-100 ${selectedMoodObj ? selectedMoodObj.color : 'gradient-primary'}`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedMoodObj?.emoji || '✨'}</span>
              <div>
                <h2 className="text-2xl font-poppins font-bold">Compartir tu {selectedMoodObj?.name.toLowerCase() || 'mood'}</h2>
                <p className="text-sm opacity-90 font-lato">¿Qué estás sintiendo ahora?</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-lato">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-2">
              Título de tu proceso
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué estás haciendo o sintiendo?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-2">
              Cuéntanos más (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comparte tu proceso, tus pensamientos, tu experiencia..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato resize-none"
            />
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-3">
              🎭 ¿Cuál es tu mood ahora?
            </label>
            <div className="grid grid-cols-4 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setPostMood(mood.id)}
                  className={`p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 ${
                    postMood === mood.id
                      ? `${mood.color} text-white ${mood.shadow} scale-105 ring-2 ring-white ring-offset-2`
                      : 'bg-gray-50 text-neutral-text hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  <span className="text-3xl animate-mood-fade">{mood.emoji}</span>
                  <span className="text-xs font-montserrat font-semibold text-center">{mood.name}</span>
                </button>
              ))}
            </div>
            {postMood && (
              <div className="mt-4 p-3 bg-gradient-to-r from-primary-purple to-primary-coral rounded-xl text-white text-center">
                <p className="font-lato text-sm">
                  ✨ Perfecto! Vas a compartir tu mood <strong>{moods.find(m => m.id === postMood)?.name}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-text font-lato mb-3">
              📷 Agregar imagen (opcional)
            </label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-purple transition-all duration-300 hover:bg-gray-50">
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <p className="text-white font-lato text-sm opacity-0 group-hover:opacity-100 transition-opacity">Haz clic para cambiar</p>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-purple to-primary-coral rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-neutral-text font-lato font-medium mb-2">Arrastra una imagen aquí</p>
                  <p className="text-neutral-secondary font-lato text-sm">o haz clic para seleccionar desde tu dispositivo</p>
                  <p className="text-xs text-neutral-secondary mt-2">PNG, JPG hasta 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title || !postMood || isUploading}
            className={`w-full py-4 px-6 rounded-xl text-white font-poppins font-semibold text-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              selectedMoodObj 
                ? `${selectedMoodObj.color} ${selectedMoodObj.shadow} focus:ring-opacity-50` 
                : 'gradient-primary shadow-primary focus:ring-primary-purple'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {uploadProgress || 'Compartiendo...'}
              </div>
            ) : (
              `Compartir mi ${selectedMoodObj?.name.toLowerCase() || 'mood'} 🚀`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
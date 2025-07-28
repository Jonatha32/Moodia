'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { postService } from '@/lib/firebaseService';
import { X, Camera, Image, Type, Smile } from 'lucide-react';

interface CreatePostProps {
  onClose: () => void;
  onPost: (post: any) => void;
}

export default function CreatePost({ onClose, onPost }: CreatePostProps) {
  const { currentMood, getMoodColor } = useMood();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const moodEmojis = {
    focus: '🎯',
    creative: '🌈',
    explorer: '🔍',
    reflective: '💭',
    chill: '😎',
    relax: '😴',
    motivated: '🔥'
  };

  const handlePost = async () => {
    if (!title.trim() || !description.trim() || !currentMood) return;

    try {
      const postData = {
        title: title.trim(),
        description: description.trim(),
        context: context.trim(),
        mood: currentMood,
        image: selectedImageFile
      };

      const newPost = await postService.createPost(postData);
      onPost(newPost);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear la publicación');
    }
  };

  const mockImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=600&fit=crop'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nueva publicación</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current Mood */}
        {currentMood && (
          <div 
            className="flex items-center gap-3 p-4 rounded-2xl mb-6 border-2"
            style={{ 
              backgroundColor: `${getMoodColor(currentMood)}15`,
              borderColor: `${getMoodColor(currentMood)}30`
            }}
          >
            <span className="text-2xl">{moodEmojis[currentMood]}</span>
            <div>
              <p className="font-semibold text-gray-800 capitalize">
                Mood: {currentMood}
              </p>
              <p className="text-sm text-gray-600">
                Tu publicación reflejará este mood
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título de tu proceso
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué estás viviendo hoy?"
            className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe tu experiencia
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comparte los detalles de tu proceso, lo que sentiste, aprendiste o experimentaste..."
            className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/500</p>
        </div>

        {/* Context */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Por qué compartes esto? (opcional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Explica tu motivación para compartir esta experiencia..."
            className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={2}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{context.length}/200</p>
        </div>

        {/* Image Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Agregar imagen (opcional)
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {mockImages.map((image, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedImage(selectedImage === image ? null : image);
                  setSelectedImageFile(null);
                }}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === image
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`Opción ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedImageFile(file);
                  setSelectedImage(URL.createObjectURL(file));
                }
              }}
              className="hidden"
              id="camera-input"
            />
            <label htmlFor="camera-input" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors text-sm cursor-pointer">
              <Camera className="w-4 h-4" />
              Cámara
            </label>
            
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedImageFile(file);
                  setSelectedImage(URL.createObjectURL(file));
                }
              }}
              className="hidden"
              id="gallery-input"
            />
            <label htmlFor="gallery-input" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors text-sm cursor-pointer">
              <Image className="w-4 h-4" />
              Galería
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePost}
            disabled={!title.trim() || !description.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publicar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
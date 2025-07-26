'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { Mood } from '@/types';

const moodOptions = [
  { mood: 'focus' as Mood, emoji: '🎯', label: 'Focus' },
  { mood: 'creative' as Mood, emoji: '🌈', label: 'Creativo' },
  { mood: 'explorer' as Mood, emoji: '🔍', label: 'Explorador' },
  { mood: 'reflective' as Mood, emoji: '💭', label: 'Reflexivo' },
  { mood: 'chill' as Mood, emoji: '😎', label: 'Chill' },
  { mood: 'relax' as Mood, emoji: '😴', label: 'Relax' },
  { mood: 'motivated' as Mood, emoji: '🔥', label: 'Motivado' },
];

interface CreatePostProps {
  currentMood: Mood;
  onSubmit: (postData: {
    title: string;
    description: string;
    mood: Mood;
    context?: string;
    image?: File;
  }) => void;
  onClose: () => void;
}

export default function CreatePost({ currentMood, onSubmit, onClose }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>(currentMood);
  const [context, setContext] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      mood: selectedMood,
      context: context.trim() || undefined,
      image: image || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setContext('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-navy">Compartir proceso</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-light rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-dark" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-navy mb-3">
                Mood
              </label>
              <div className="flex flex-wrap gap-3">
                {moodOptions.map((option) => (
                  <button
                    key={option.mood}
                    type="button"
                    onClick={() => setSelectedMood(option.mood)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedMood === option.mood
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium hover:shadow-sm'
                    }`}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="¿Qué proceso querés compartir?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contanos sobre tu proceso..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Por qué compartís esto? (opcional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contexto emocional..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen (opcional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Subir imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !description.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
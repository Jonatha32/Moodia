import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../services/postService';
import { uploadImageToCloudinary } from '../services/imageService';
import { moods } from '../config/moods';

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const selectedMoodObject = moods.find(m => m.id === selectedMood);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !selectedMood) {
      setError('El título y el mood son obligatorios.');
      return;
    }

    if (!currentUser) {
      setError('Debes estar autenticado para publicar.');
      return;
    }

    setIsUploading(true);

    try {
      let imageData: { url?: string; publicId?: string } = {};

      // 1. Si hay una imagen, subirla primero a Cloudinary
      if (imageFile) {
        const { secure_url, public_id } = await uploadImageToCloudinary(imageFile);
        imageData = { url: secure_url, publicId: public_id };
      }

      // 2. Crear el post en Firestore con la URL de la imagen (si existe)
      await createPost({
        title,
        description,
        mood: selectedMood,
        userId: currentUser.uid,
        imageUrl: imageData.url,
        imagePublicId: imageData.publicId,

      });
      setSuccess('¡Tu post ha sido publicado con éxito!');
      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setSelectedMood('');
      setImageFile(null);
      onPostCreated?.(); // Notificar al componente padre
    } catch (err) {
      setError('Ocurrió un error al publicar tu post.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <input type="text" placeholder="Título de tu proceso..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg" />
      <textarea placeholder="¿Qué estás haciendo o sintiendo?" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-lg h-24" />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona tu mood:</label>
        <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
          <option value="" disabled>Elige un mood...</option>
          {moods.map(mood => <option key={mood.id} value={mood.id}>{mood.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Añadir imagen (opcional):</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary-purple hover:file:bg-violet-100"/>
      </div>
      <button type="submit" disabled={isUploading || !title || !selectedMood} className={`w-full p-3 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
          selectedMoodObject ? `${selectedMoodObject.color} hover:opacity-90` : 'bg-primary-purple hover:bg-opacity-90'
        }`}>
        {isUploading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  );
};

export default CreatePostForm;

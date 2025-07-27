'use client';

import { useMood } from '@/contexts/MoodContext';
import PostCard from './PostCard';
import { Post } from '@/types';

// Mock data para el feed
const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Ana García',
    title: 'Mi rutina matutina de meditación',
    description: 'Hoy desperté con una energía increíble. Decidí empezar el día con 20 minutos de meditación y realmente siento la diferencia. La tranquilidad mental que logré me acompañó durante toda la mañana.',
    mood: 'reflective',
    context: 'Quiero inspirar a otros a encontrar momentos de paz en su día',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    reactions: {
      love: ['user2', 'user3'],
      support: ['user2'],
      helpful: ['user4'],
      inspiring: ['user3', 'user4'],
      learned: [],
      share: ['user2'],
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Carlos López',
    title: 'Proyecto de arte digital',
    description: 'Llevo semanas trabajando en esta ilustración digital. Es increíble cómo cada trazo cuenta una historia diferente. El proceso creativo me tiene completamente absorto.',
    mood: 'creative',
    context: 'El arte es mi forma de expresar lo que las palabras no pueden',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    reactions: {
      love: ['user1', 'user3', 'user4'],
      support: [],
      helpful: [],
      inspiring: ['user1', 'user4'],
      learned: ['user3'],
      share: ['user1'],
    },
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'María Rodríguez',
    title: 'Aprendiendo React Native',
    description: 'Hoy fue mi primer día sumergiéndome en React Native. Es desafiante pero emocionante ver cómo puedo crear aplicaciones móviles. Cada error es una oportunidad de aprender algo nuevo.',
    mood: 'focus',
    context: 'Documentando mi journey como desarrolladora',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop',
    reactions: {
      love: ['user1'],
      support: ['user1', 'user2', 'user4'],
      helpful: ['user2'],
      inspiring: ['user4'],
      learned: ['user1', 'user2'],
      share: [],
    },
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Diego Martín',
    title: 'Sesión de fotos en la naturaleza',
    description: 'Salí temprano a capturar la luz dorada del amanecer. Hay algo mágico en estar solo con la cámara y la naturaleza. Cada foto cuenta una historia del momento perfecto.',
    mood: 'explorer',
    context: 'La fotografía me conecta con el mundo de una manera única',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    reactions: {
      love: ['user1', 'user2'],
      support: ['user3'],
      helpful: [],
      inspiring: ['user1', 'user2', 'user3'],
      learned: [],
      share: ['user3'],
    },
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Sofía Chen',
    title: 'Tarde de lectura y café',
    description: 'No hay nada como una tarde lluviosa, un buen libro y una taza de café caliente. Hoy elegí desconectarme del mundo digital y sumergirme en las páginas de una novela.',
    mood: 'chill',
    context: 'A veces necesitamos pausar para recargar energías',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    reactions: {
      love: ['user1', 'user3'],
      support: ['user2', 'user4'],
      helpful: [],
      inspiring: ['user2'],
      learned: [],
      share: ['user1'],
    },
    createdAt: new Date('2024-01-11'),
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Alejandro Ruiz',
    title: 'Entrenamiento de fuerza',
    description: 'Hoy superé mi récord personal en peso muerto. Cada repetición era una batalla mental tanto como física. La disciplina y constancia están dando frutos increíbles.',
    mood: 'motivated',
    context: 'El gimnasio es mi templo de autodisciplina',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    reactions: {
      love: ['user2', 'user4'],
      support: ['user1', 'user3', 'user5'],
      helpful: ['user3'],
      inspiring: ['user1', 'user2', 'user5'],
      learned: [],
      share: [],
    },
    createdAt: new Date('2024-01-10'),
  },
];

export default function FeedGrid() {
  const { currentMood } = useMood();

  // Filtrar posts por mood actual (si existe)
  const filteredPosts = currentMood 
    ? mockPosts.filter(post => post.mood === currentMood)
    : mockPosts;

  if (filteredPosts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay publicaciones para tu mood actual
          </h3>
          <p className="text-gray-600">
            ¡Sé el primero en compartir algo {currentMood}!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
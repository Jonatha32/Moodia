import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import CreatePostForm from '../components/CreatePostForm';
import { getPosts } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { moods } from '../config/moods';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const { selectedMood } = useMood();
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    setLoadingPosts(true);
    const unsubscribe = getPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoadingPosts(false);
    }, selectedMood);

    // Limpia la suscripción cuando el componente se desmonta o el mood cambia
    return () => unsubscribe();
  }, [selectedMood]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <img src="/logo.png" alt="Moodia Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-poppins font-bold text-neutral-text mb-4">
          ¡Hola, {currentUser?.displayName || currentUser?.email || 'Moodier'}! 👋
        </h1>
        <p className="text-lg text-neutral-secondary">
          ¿Cómo te sentís hoy?
        </p>
      </div>

      <CreatePostForm />

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-poppins font-bold text-neutral-navy mb-6">
          {selectedMood ? `Feed de ${moods.find(m => m.id === selectedMood)?.name}` : 'Feed General'}
        </h2>
        {loadingPosts 
          ? (<p className="text-center text-gray-500">Cargando posts...</p>) 
          : posts.length > 0 
            ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) 
            : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg">Aún no hay publicaciones para este mood.</p>
                  <p className="text-sm">¡Sé el primero en compartir tu proceso!</p>
                </div>
              )
        }
      </div>
    </div>
  );
};

export default Home;
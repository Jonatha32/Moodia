import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import { getPosts } from '../services/postService';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import MoodSelector from '../components/MoodSelector';
import FloatingActionButton from '../components/FloatingActionButton';
import CreatePostModal from '../components/CreatePostModal';
import PostDetailModal from '../components/PostDetailModal';
import { moods } from '../config/moods';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const { selectedMood } = useMood();
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setSearchBarVisibility] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);

  useEffect(() => {
    setLoadingPosts(true);
    const unsubscribe = getPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoadingPosts(false);
    }); // Removido selectedMood para mostrar todos los posts

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // Removido selectedMood de las dependencias

  const filteredPosts = posts.filter(post => 
    searchQuery === '' || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMood = moods.find(m => m.id === selectedMood);

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-900">
      {/* Top Search Bar - Sticky */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 ">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Feed Vertical - Estilo Instagram/TikTok */}
      <div className="max-w-md mx-auto">
        {loadingPosts ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-secondary font-lato text-sm">Cargando posts...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-0">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard 
                  post={post} 
                  onPostClick={(post) => {
                    setSelectedPost(post);
                    setIsPostDetailOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="text-6xl mb-4">
              {searchQuery ? '🔍' : '📝'}
            </div>
            <h3 className="text-xl font-poppins font-bold text-neutral-text mb-3">
              {searchQuery 
                ? 'No encontramos resultados' 
                : 'Aún no hay posts'
              }
            </h3>
            <p className="text-neutral-secondary font-lato text-sm mb-6">
              {searchQuery 
                ? 'Intenta con otras palabras' 
                : '¡Sé el primero en compartir!'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="gradient-primary text-white px-6 py-3 rounded-xl font-poppins font-semibold shadow-primary hover:scale-105 transition-transform duration-200 text-sm"
              >
                Crear post 🚀
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mood Selector Flotante */}
      <MoodSelector />
      
      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setCreateModalOpen(true)} />

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
      
      {/* Post Detail Modal */}
      <PostDetailModal 
        post={selectedPost}
        isOpen={isPostDetailOpen}
        onClose={() => {
          setIsPostDetailOpen(false);
          setSelectedPost(null);
        }}
      />
    </div>
  );
};

export default Home;
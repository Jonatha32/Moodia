'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { postService } from '@/lib/firebaseService';
import PostCard from './PostCard';
import { Post } from '@/types';

export default function FeedGrid() {
  const { currentMood, getMoodColor } = useMood();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    
    try {
      const fetchedPosts = await postService.getPosts(currentMood || undefined, 20);
      setPosts(fetchedPosts as Post[]);
      setHasMore(fetchedPosts.length === 20);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMood]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const loadMore = async () => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        const morePosts = await postService.getPosts(currentMood || undefined, 10);
        setPosts(prev => [...prev, ...morePosts as Post[]]);
        setHasMore(morePosts.length === 10);
      } catch (error) {
        console.error('Error loading more posts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay publicaciones para tu mood actual
          </h3>
          <p className="text-gray-600">
            ¡Sé el primero en compartir algo {currentMood}!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mood-based background gradient */}
      {currentMood && (
        <div 
          className="fixed inset-0 opacity-5 pointer-events-none transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${getMoodColor(currentMood)}20 0%, transparent 70%)`
          }}
        />
      )}
      
      <div className="max-w-2xl mx-auto space-y-8">
        {posts.map((post, index) => (
          <motion.div
            key={`${post.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cargando...
              </div>
            ) : (
              'Ver más publicaciones'
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}
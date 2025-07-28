'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { useMockData } from '@/hooks/useMockData';
import { Post } from '@/types';
import TikTokPost from './TikTokPost';

export default function TikTokFeed() {
  const { currentMood, getMoodColor, getMoodGradient } = useMood();
  const { getPostsByMood, getAllPosts } = useMockData();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const moodPosts = currentMood ? getPostsByMood(currentMood) : getAllPosts();
    const extendedPosts = [...moodPosts, ...moodPosts, ...moodPosts]; // Simulate infinite content
    setPosts(extendedPosts);
    setCurrentIndex(0);
  }, [currentMood, getPostsByMood, getAllPosts]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      setIsScrolling(true);
      
      if (e.deltaY > 0 && currentIndex < posts.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }

      setTimeout(() => setIsScrolling(false), 800);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' && currentIndex < posts.length - 1) {
        setIsScrolling(true);
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 800);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setIsScrolling(true);
        setCurrentIndex(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [currentIndex, posts.length, isScrolling]);

  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3]);

  if (posts.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 top-16 overflow-hidden"
      style={{
        background: currentMood ? getMoodGradient(currentMood) : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: currentMood ? `radial-gradient(circle at center, ${getMoodColor(currentMood)}40 0%, transparent 70%)` : 'transparent',
          opacity: backgroundOpacity
        }}
      />

      {/* Posts Container */}
      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.8
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <TikTokPost 
              post={posts[currentIndex]} 
              isActive={true}
              index={currentIndex}
              total={posts.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
        {posts.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
          const actualIndex = Math.max(0, currentIndex - 2) + idx;
          return (
            <motion.div
              key={actualIndex}
              className={`w-1 rounded-full transition-all duration-300 ${
                actualIndex === currentIndex 
                  ? 'h-8 bg-white' 
                  : 'h-2 bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          );
        })}
      </div>

      {/* Scroll Hint */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: [1, 0.5, 1], y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/80 text-center"
        >
          <div className="text-sm font-medium mb-2">Desliza para ver más</div>
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
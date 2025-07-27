'use client';

import { Heart, MessageCircle, Share2, Bookmark, Star, MoreHorizontal } from 'lucide-react';
import { Post } from '@/types';

const moodEmojis = {
  focus: '🎯',
  creative: '🌈',
  explorer: '🔍',
  reflective: '💭',
  chill: '😎',
  relax: '😴',
  motivated: '🔥'
};

const moodColors = {
  focus: 'bg-blue-100 text-blue-800',
  creative: 'bg-pink-100 text-pink-800',
  explorer: 'bg-green-100 text-green-800',
  reflective: 'bg-purple-100 text-purple-800',
  chill: 'bg-cyan-100 text-cyan-800',
  relax: 'bg-gray-100 text-gray-800',
  motivated: 'bg-red-100 text-red-800'
};

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      {/* Post Image */}
      {post.imageUrl && (
        <div className="aspect-square overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {post.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{post.userName}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Mood Badge */}
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${moodColors[post.mood]}`}>
            <span>{moodEmojis[post.mood]}</span>
            <span className="capitalize">{post.mood}</span>
          </div>
        </div>

        {/* Post Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Post Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {post.description}
        </p>

        {/* Context */}
        {post.context && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 italic">"{post.context}"</p>
          </div>
        )}

        {/* Reactions Summary */}
        <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
          {Object.entries(post.reactions).map(([reaction, users]) => {
            if (users.length === 0) return null;
            return (
              <span key={reaction} className="flex items-center space-x-1">
                <span>{users.length}</span>
                <span className="capitalize">{reaction}</span>
              </span>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Me encanta</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Comentar</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors duration-200">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Compartir</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-yellow-500 transition-colors duration-200">
              <Star className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-purple-500 transition-colors duration-200">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
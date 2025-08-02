import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, UserProfile } from '../types';
import { getUserProfile } from '../services/userService';
import { toggleReaction } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { moods } from '../config/moods';

interface PostCardProps {
  post: Post;
}

const reactionsConfig = [
  { type: 'love', emoji: '❤️' },
  { type: 'support', emoji: '🙌' },
  { type: 'inspiring', emoji: '💡' },
  { type: 'celebrate', emoji: '🎉' },
];

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const postMood = moods.find(m => m.id === post.mood);

  useEffect(() => {
    const fetchAuthor = async () => {
      const userProfile = await getUserProfile(post.userId);
      setAuthor(userProfile);
    };
    fetchAuthor();
  }, [post.userId]);

  const handleReaction = (reactionType: string) => {
    if (!currentUser) return;
    toggleReaction(post.id, reactionType, currentUser.uid);
  };

  if (!author) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
      )}
      <div className="p-6">
        <Link to={`/profile/${author.uid}`} className="flex items-center mb-4 group">
          <img
            src={author.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${author.displayName}`}
            alt={author.displayName || 'Avatar'}
            className="w-10 h-10 rounded-full mr-3 transition-transform group-hover:scale-110"
          />
          <div>
            <p className="font-bold text-neutral-navy group-hover:text-primary-purple transition-colors">
              {author.displayName}
            </p>
            <p className="text-xs text-gray-500">
              {post.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        </Link>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold font-poppins text-neutral-navy">{post.title}</h3>
            {postMood && (
              <div className={`${postMood.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center`}>
                {postMood.emoji}
                <span className="ml-1.5">{postMood.name}</span>
              </div>
            )}
          </div>
          <p className="text-gray-700">{post.description}</p>
        </div>

        <div className="border-t border-gray-200 pt-4 flex items-center space-x-2">
          {reactionsConfig.map(({ type, emoji }) => {
            const reactionCount = post.reactions?.[type]?.length || 0;
            const userHasReacted = currentUser && post.reactions?.[type]?.includes(currentUser.uid);

            return (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  userHasReacted
                    ? 'bg-primary-purple text-white'
                    : 'bg-neutral-light hover:bg-gray-200'
                }`}
              >
                <span>{emoji}</span>
                {reactionCount > 0 && <span>{reactionCount}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
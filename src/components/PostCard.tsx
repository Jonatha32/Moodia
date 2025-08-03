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

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mira este post en Moodia: ${post.title}`,
          text: post.description,
          url: postUrl,
        });
      } catch (error) {
        console.error('Error al compartir', error);
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      alert('¡Enlace copiado!');
    }
  };

  if (!author) {
    return (
      <div className="w-full bg-white animate-pulse">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="w-full aspect-square bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header del Post */}
      <div className="flex items-center justify-between p-4">
        <Link to={`/profile/${author.uid}`} className="flex items-center group">
          <img
            src={author.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${author.displayName}`}
            alt={author.displayName || 'Avatar'}
            className="w-10 h-10 rounded-full mr-3 transition-transform group-hover:scale-110 border-2 border-gray-200"
          />
          <div>
            <p className="font-bold text-neutral-text group-hover:text-primary-purple transition-colors text-sm">
              {author.displayName}
            </p>
            <p className="text-xs text-neutral-secondary">
              {post.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        </Link>
        
        {postMood && (
          <div className={`${postMood.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center`}>
            {postMood.emoji}
            <span className="ml-1.5">{postMood.name}</span>
          </div>
        )}
      </div>

      {/* Imagen del Post */}
      {post.imageUrl && (
        <div className="w-full aspect-square bg-gray-100">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Acciones del Post */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            {reactionsConfig.map(({ type, emoji }) => {
              const reactionCount = post.reactions?.[type]?.length || 0;
              const userHasReacted = currentUser && post.reactions?.[type]?.includes(currentUser.uid);

              return (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className={`flex items-center space-x-1 transition-transform hover:scale-110 ${
                    userHasReacted ? 'text-red-500' : 'text-neutral-text hover:text-red-500'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  {reactionCount > 0 && <span className="text-sm font-medium">{reactionCount}</span>}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={handleShare}
            className="text-neutral-text hover:text-primary-purple transition-colors"
            aria-label="Compartir post"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        {/* Contenido del Post */}
        <div>
          <h3 className="font-bold text-neutral-text mb-1 font-poppins">{post.title}</h3>
          <p className="text-neutral-text text-sm leading-relaxed">{post.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
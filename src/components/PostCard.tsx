import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, UserProfile } from '../types';
import { getUserProfile } from '../services/userService';
import { toggleReaction, toggleHighlightPost } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { moods } from '../config/moods';

interface PostCardProps {
  post: Post;
  onPostClick?: (post: Post) => void;
}

const reactionsConfig = [
  { type: 'love', emoji: '❤️' },
  { type: 'support', emoji: '🙌' },
  { type: 'inspiring', emoji: '💡' },
  { type: 'celebrate', emoji: '🎉' },
];

const PostCard: React.FC<PostCardProps> = ({ post, onPostClick }) => {
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const postMood = moods.find(m => m.id === post.mood);

  useEffect(() => {
    const fetchAuthor = async () => {
      console.log('PostCard - Fetching author for post.userId:', post.userId);
      const userProfile = await getUserProfile(post.userId);
      console.log('PostCard - Author found:', userProfile?.displayName, 'uid:', userProfile?.uid);
      setAuthor(userProfile);
    };
    fetchAuthor();
  }, [post.userId]);

  const handleReaction = (reactionType: string) => {
    if (!currentUser) return;
    toggleReaction(post.id, reactionType, currentUser.uid);
  };

  const handleToggleHighlight = async () => {
    if (!currentUser || currentUser.uid !== post.userId) return;
    await toggleHighlightPost(post.id, !post.isHighlighted);
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
        <div 
          className="w-full aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer"
          onClick={() => onPostClick?.(post)}
        >
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy"
          />
          {post.isHighlighted && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm">⭐</span>
            </div>
          )}
          {/* Overlay para indicar que es clickeable */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-2">
              <svg className="w-6 h-6 text-neutral-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
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
            
            {/* Comentarios */}
            <div className="flex items-center space-x-1 text-neutral-text">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {(post.commentsCount || 0) > 0 && <span className="text-sm font-medium">{post.commentsCount}</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Botón destacar (solo para el autor) */}
            {currentUser && currentUser.uid === post.userId && (
              <button
                onClick={handleToggleHighlight}
                className={`transition-colors ${
                  post.isHighlighted 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-neutral-text hover:text-yellow-500'
                }`}
                aria-label={post.isHighlighted ? 'Quitar de destacados' : 'Marcar como destacado'}
                title={post.isHighlighted ? 'Quitar de destacados' : 'Marcar como destacado'}
              >
                <svg className="w-6 h-6" fill={post.isHighlighted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}
            
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
        </div>

        {/* Contenido del Post */}
        <div 
          className="cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors"
          onClick={() => onPostClick?.(post)}
        >
          <h3 className="font-bold text-neutral-text mb-1 font-poppins">{post.title}</h3>
          <p className="text-neutral-text text-sm leading-relaxed">{post.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
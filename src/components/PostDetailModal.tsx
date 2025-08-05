import React, { useState, useEffect } from 'react';
import { Post, UserProfile } from '../types';
import { getUserProfile } from '../services/userService';
import { toggleReaction, addComment, getPostComments, deleteComment } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { moods } from '../config/moods';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const reactionsConfig = [
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'support', emoji: '🙌', label: 'Apoyo esto' },
  { type: 'inspiring', emoji: '💡', label: 'Me inspira' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebro' },
];

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(post);

  useEffect(() => {
    if (!post) return;

    const fetchAuthor = async () => {
      const userProfile = await getUserProfile(post.userId);
      setAuthor(userProfile);
    };

    // Escuchar cambios del post en tiempo real
    const unsubscribePost = onSnapshot(doc(db, 'posts', post.id), (doc) => {
      if (doc.exists()) {
        setCurrentPost({ id: doc.id, ...doc.data() } as Post);
      }
    });

    const unsubscribeComments = getPostComments(post.id, setComments);
    fetchAuthor();

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [post]);

  const handleReaction = (reactionType: string) => {
    if (!currentUser || !currentPost) return;
    toggleReaction(currentPost.id, reactionType, currentUser.uid);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentPost || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(currentPost.id, currentUser.uid, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !currentPost || !author) return null;

  const postMood = moods.find(m => m.id === currentPost.mood);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in flex">
        {/* Imagen */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {currentPost.imageUrl ? (
            <img 
              src={currentPost.imageUrl} 
              alt={currentPost.title}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className={`w-full h-full ${postMood?.color || 'bg-gray-200'} flex items-center justify-center text-8xl`}>
              {postMood?.emoji || '📝'}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="w-96 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={author.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${author.displayName}`}
                alt={author.displayName || 'Avatar'}
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
              <div>
                <p className="font-montserrat font-bold text-neutral-text">{author.displayName}</p>
                <div className={`${postMood?.color || 'bg-gray-200'} text-white text-xs px-2 py-1 rounded-full inline-flex items-center gap-1`}>
                  {postMood?.emoji} {postMood?.name}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Post Content */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-poppins font-bold text-neutral-text mb-2">{currentPost.title}</h3>
            <p className="text-neutral-text text-sm leading-relaxed">{currentPost.description}</p>
            <p className="text-xs text-neutral-secondary mt-2">
              {currentPost.createdAt?.toDate().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Reactions */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              {reactionsConfig.map(({ type, emoji, label }) => {
                const reactionCount = currentPost.reactions?.[type]?.length || 0;
                const userHasReacted = currentUser && currentPost.reactions?.[type]?.includes(currentUser.uid);

                return (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:scale-110 ${
                      userHasReacted ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50'
                    }`}
                    title={label}
                  >
                    <span className="text-xl">{emoji}</span>
                    {reactionCount > 0 && <span className="text-xs font-medium">{reactionCount}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="font-poppins font-bold text-neutral-text dark:text-white mb-3">
              Comentarios ({comments.length})
            </h4>
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-neutral-secondary dark:text-gray-400 text-sm">Sé el primero en comentar</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    currentUserId={currentUser?.uid}
                    postAuthorId={currentPost?.userId}
                  />
                ))
              )}
            </div>
          </div>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-2">
              <img
                src={currentUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.displayName}`}
                alt="Tu avatar"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full px-3 py-2 pr-12 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-sm bg-white dark:bg-gray-700 text-neutral-text dark:text-white placeholder-neutral-secondary dark:placeholder-gray-400 transition-all"
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-neutral-secondary dark:text-gray-400">
                  {newComment.length}/500
                </div>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting || newComment.length > 500}
                className="px-4 py-2 bg-primary-purple text-white rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-medium shadow-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>...</span>
                  </div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            {newComment.length > 450 && (
              <p className="text-xs text-orange-500 mt-1 ml-10">
                {500 - newComment.length} caracteres restantes
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: any;
  currentUserId?: string;
  postAuthorId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, currentUserId, postAuthorId }) => {
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      const userProfile = await getUserProfile(comment.userId);
      setAuthor(userProfile);
    };
    fetchAuthor();
  }, [comment.userId]);

  const handleDelete = async () => {
    if (!currentUserId || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteComment(comment.id, comment.postId);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = currentUserId && (currentUserId === comment.userId || currentUserId === postAuthorId);
  const isAuthor = comment.userId === postAuthorId;

  if (!author) {
    return (
      <div className="flex gap-2 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 group">
      <img
        src={author.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${author.displayName}`}
        alt={author.displayName || 'Avatar'}
        className="w-8 h-8 rounded-full border border-gray-200"
      />
      <div className="flex-1">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="font-montserrat font-bold text-xs text-neutral-text dark:text-white">
                {author.displayName}
              </p>
              {isAuthor && (
                <span className="bg-primary-purple text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Autor
                </span>
              )}
            </div>
            
            {canDelete && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm text-neutral-text dark:text-gray-200 leading-relaxed">{comment.text}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-3">
          <p className="text-xs text-neutral-secondary dark:text-gray-400">
            {comment.createdAt?.toDate?.().toLocaleDateString('es-ES', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
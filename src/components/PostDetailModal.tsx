import React, { useState, useEffect } from 'react';
import { Post, UserProfile } from '../types';
import { getUserProfile } from '../services/userService';
import { toggleReaction, addComment, getPostComments } from '../services/postService';
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
            <h4 className="font-poppins font-bold text-neutral-text mb-3">
              Comentarios ({comments.length})
            </h4>
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <img
                src={currentUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.displayName}`}
                alt="Tu avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple text-sm"
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-4 py-2 bg-primary-purple text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSubmitting ? '...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CommentItem: React.FC<{ comment: any }> = ({ comment }) => {
  const [author, setAuthor] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      const userProfile = await getUserProfile(comment.userId);
      setAuthor(userProfile);
    };
    fetchAuthor();
  }, [comment.userId]);

  if (!author) return null;

  return (
    <div className="flex gap-2">
      <img
        src={author.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${author.displayName}`}
        alt={author.displayName || 'Avatar'}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="font-montserrat font-bold text-xs text-neutral-text">{author.displayName}</p>
          <p className="text-sm text-neutral-text mt-1">{comment.text}</p>
        </div>
        <p className="text-xs text-neutral-secondary mt-1 ml-3">
          {comment.createdAt?.toDate?.().toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};

export default PostDetailModal;
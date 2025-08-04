import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post, UserProfile } from '../types';
import { getUserProfile, getUserStats, followUser, unfollowUser, isFollowing } from '../services/userService';
import { getPostsByUserId, getHighlightedPostsByUserId } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import ChangePhotoModal from '../components/ChangePhotoModal';
import MoodJourneyModal from '../components/MoodJourneyModal';
import PostDetailModal from '../components/PostDetailModal';
import { moods } from '../config/moods';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const { selectedMood } = useMood();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [highlightedPosts, setHighlightedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userStats, setUserStats] = useState({ totalPosts: 0, followers: 0, following: 0, streakDays: 0, moodCounts: {} as Record<string, number> });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePhotoModalOpen, setIsChangePhotoModalOpen] = useState(false);
  const [isMoodJourneyModalOpen, setIsMoodJourneyModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);

  const isOwnProfile = currentUser?.uid === userId;
  const currentMood = moods.find(m => m.id === selectedMood);
  
  // Usar estadísticas del backend
  const { totalPosts, followers, following, streakDays, moodCounts } = userStats;

  useEffect(() => {
    if (!userId) {
      setError('No se ha especificado un ID de usuario.');
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getUserProfile(userId);
        if (!profile) {
          setError('Perfil no encontrado.');
        } else {
          setUserProfile(profile);
          
          // Cargar estadísticas
          const stats = await getUserStats(userId);
          setUserStats(stats);
          
          // Verificar si sigue al usuario
          if (currentUser && !isOwnProfile) {
            console.log('Verificando si sigue al usuario:', { currentUser: currentUser.uid, targetUser: userId });
            const following = await isFollowing(currentUser.uid, userId);
            console.log('Estado de seguimiento:', following);
            setIsFollowingUser(following);
          }
          
          unsubscribe = getPostsByUserId(userId, (posts) => {
            setUserPosts(posts);
          });
          
          // Cargar posts destacados
          const unsubscribeHighlighted = getHighlightedPostsByUserId(userId, (posts) => {
            setHighlightedPosts(posts);
          });
          
          // Combinar ambas suscripciones
          const originalUnsubscribe = unsubscribe;
          unsubscribe = () => {
            originalUnsubscribe();
            unsubscribeHighlighted();
          };
        }
      } catch (err) {
        setError('Error al cargar los datos del perfil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    return () => unsubscribe();
  }, [userId, currentUser]);

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${userProfile?.displayName} en Moodia`,
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error al compartir', error);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert('¡Enlace copiado!');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-purple border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-neutral-secondary font-lato text-sm">Cargando perfil...</p>
    </div>
  );
  
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!userProfile) return <div className="text-center p-10">Este perfil no existe.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header de Perfil */}
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Foto de Perfil */}
          <div className="relative group">
            <img
              src={userProfile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.displayName}`}
              alt={userProfile.displayName || 'Avatar'}
              className={`w-32 h-32 rounded-full border-4 transition-all duration-300 ${isOwnProfile ? 'cursor-pointer hover:opacity-80 hover:scale-105' : ''} ${
                currentMood 
                  ? `${currentMood.color.replace('bg-', 'border-')} border-opacity-80 shadow-lg` 
                  : 'border-primary-purple border-opacity-50'
              }`}
            />
            {isOwnProfile && (
              <div 
                className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer"
                onClick={() => setIsChangePhotoModalOpen(true)}
              >
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info del Usuario */}
          <div className="flex-1 text-center md:text-left">
            {/* Mood Actual */}
            {currentMood && isOwnProfile && (
              <div className="mb-3">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentMood.color} text-white text-sm font-montserrat font-bold ${currentMood.shadow} animate-mood-fade`} title={`Today's Mood: ${currentMood.name}`}>
                  <span className="text-lg animate-mood-fade">{currentMood.emoji}</span>
                  {currentMood.name}
                </div>
              </div>
            )}

            {/* Nombre y Username */}
            <h1 className="text-4xl font-montserrat font-bold text-neutral-text mb-2 tracking-tight">
              {userProfile.displayName}
            </h1>
            <p className="text-neutral-secondary font-lato font-medium mb-4 text-lg">
              @{userProfile.displayName?.toLowerCase().replace(/\s+/g, '')}
            </p>

            {/* Bio */}
            <p className="text-neutral-text font-lato font-normal mb-4 max-w-md leading-relaxed text-base">
              {userProfile.bio || 'Compartiendo mi journey auténtico en Moodia 🌟 Cada día es una nueva oportunidad para crecer.'}
            </p>

            {/* Ubicación */}
            {userProfile.location && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-secondary text-sm mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{userProfile.location}</span>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-6 py-3 bg-primary-purple text-white rounded-xl font-poppins font-semibold hover:scale-105 transition-transform duration-200 shadow-primary"
                  >
                    Editar Perfil
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-neutral-text rounded-xl font-poppins font-semibold hover:bg-gray-200 transition-colors">
                    Ajustes
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={async () => {
                      if (!currentUser || followLoading) return;
                      
                      setFollowLoading(true);
                      console.log('=== INICIO SEGUIR ===');
                      console.log('Datos:', { currentUser: currentUser.uid, targetUser: userId, isFollowing: isFollowingUser });
                      
                      try {
                        if (isFollowingUser) {
                          console.log('Ejecutando unfollowUser...');
                          await unfollowUser(currentUser.uid, userId!);
                          console.log('unfollowUser completado');
                          setIsFollowingUser(false);
                        } else {
                          console.log('Ejecutando followUser...');
                          await followUser(currentUser.uid, userId!);
                          console.log('followUser completado');
                          setIsFollowingUser(true);
                        }
                        
                        console.log('Actualizando estadísticas...');
                        const stats = await getUserStats(userId!);
                        console.log('Estadísticas actualizadas:', stats);
                        setUserStats(stats);
                        console.log('=== FIN SEGUIR EXITOSO ===');
                        
                      } catch (error) {
                        console.error('=== ERROR EN SEGUIR ===', error);
                        alert('Error: ' + error.message);
                      } finally {
                        console.log('Finalizando loading...');
                        setFollowLoading(false);
                      }
                    }}
                    disabled={followLoading}
                    className={`px-6 py-3 rounded-xl font-poppins font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isFollowingUser 
                        ? 'bg-gray-100 text-neutral-text hover:bg-gray-200' 
                        : 'gradient-primary text-white shadow-primary'
                    }`}
                  >
                    {followLoading ? 'Cargando...' : (isFollowingUser ? 'Siguiendo' : 'Seguir')}
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-neutral-text rounded-xl font-poppins font-semibold hover:bg-gray-200 transition-colors">
                    Mensaje
                  </button>
                </>
              )}
              <button 
                onClick={handleShare}
                className="px-4 py-3 bg-gray-100 text-neutral-text rounded-xl hover:bg-gray-200 transition-colors"
                title="Compartir perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Posts Totales */}
          <div className="text-center">
            <div className="text-3xl font-poppins font-bold text-neutral-text mb-1">{totalPosts}</div>
            <div className="text-sm text-neutral-secondary font-lato">Posts</div>
          </div>

          {/* Seguidores */}
          <div className="text-center">
            <div className="text-3xl font-poppins font-bold text-neutral-text mb-1">{followers}</div>
            <div className="text-sm text-neutral-secondary font-lato">Seguidores</div>
          </div>

          {/* Siguiendo */}
          <div className="text-center">
            <div className="text-3xl font-poppins font-bold text-neutral-text mb-1">{following}</div>
            <div className="text-sm text-neutral-secondary font-lato">Siguiendo</div>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-3xl font-poppins font-bold text-neutral-text">{streakDays}</span>
              {streakDays > 0 && <span className="text-2xl">🔥</span>}
            </div>
            <div className="text-sm text-neutral-secondary font-lato">Días de racha</div>
          </div>
        </div>

        {/* Mood Journey Button */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button 
            onClick={() => setIsMoodJourneyModalOpen(true)}
            className="w-full py-3 px-6 bg-gradient-to-r from-primary-purple to-primary-coral text-white rounded-xl font-poppins font-semibold hover:scale-105 transition-transform duration-200 shadow-primary"
          >
            📊 Ver Mood Journey
          </button>
        </div>
      </div>

      {/* Posts Destacados */}
      {highlightedPosts.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-xl font-poppins font-bold text-neutral-text mb-4">
            ⭐ Posts Destacados
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {highlightedPosts.slice(0, 6).map((post) => {
              const postMood = moods.find(m => m.id === post.mood);
              return (
                <div key={post.id} className="flex-shrink-0 w-20 h-20 relative group cursor-pointer hover:scale-110 transition-transform duration-200">
                  {post.imageUrl ? (
                    <div className="w-full h-full rounded-full overflow-hidden border-3 border-yellow-400 shadow-lg">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-full h-full rounded-full ${postMood?.color || 'bg-gray-200'} ${postMood?.shadow} flex items-center justify-center text-xl border-3 border-yellow-400`}>
                      {postMood?.emoji || '📝'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg">
                    ⭐
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {post.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-bold text-neutral-text">
            Posts de {userProfile.displayName}
          </h2>
          
          {/* View Toggle */}
          {userPosts.length > 0 && (
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-md text-primary-purple scale-105' 
                    : 'text-neutral-secondary hover:text-neutral-text hover:bg-gray-50'
                }`}
                title="Vista Cuadrícula"
              >
                <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-md text-primary-purple scale-105' 
                    : 'text-neutral-secondary hover:text-neutral-text hover:bg-gray-50'
                }`}
                title="Vista Lista"
              >
                <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Filtros por Mood */}
        {userPosts.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedMoodFilter('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-all duration-200 ${
                  selectedMoodFilter === 'all'
                    ? 'bg-primary-purple text-white shadow-primary'
                    : 'bg-gray-100 text-neutral-text hover:bg-gray-200'
                }`}
              >
                🌟 Todos
              </button>
              {Object.entries(moodCounts).map(([moodId, count]) => {
                const mood = moods.find(m => m.id === moodId);
                if (!mood) return null;
                return (
                  <button
                    key={moodId}
                    onClick={() => setSelectedMoodFilter(moodId)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl font-poppins font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      selectedMoodFilter === moodId
                        ? `${mood.color} text-white ${mood.shadow}`
                        : 'bg-gray-100 text-neutral-text hover:bg-gray-200'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.name}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Posts Display */}
        {(() => {
          const filteredPosts = selectedMoodFilter === 'all' 
            ? userPosts 
            : userPosts.filter(post => post.mood === selectedMoodFilter);

          if (filteredPosts.length === 0) {
            return (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {selectedMoodFilter === 'all' ? '📝' : moods.find(m => m.id === selectedMoodFilter)?.emoji || '📝'}
                </div>
                <h3 className="text-xl font-poppins font-bold text-neutral-text mb-2">
                  {selectedMoodFilter === 'all'
                    ? (isOwnProfile ? 'Aún no has publicado nada' : `${userProfile.displayName} aún no ha publicado`)
                    : `No hay posts en mood ${moods.find(m => m.id === selectedMoodFilter)?.name}`
                  }
                </h3>
                <p className="text-neutral-secondary font-lato">
                  {selectedMoodFilter === 'all'
                    ? (isOwnProfile ? '¡Comparte tu primer mood!' : 'Vuelve pronto para ver sus posts')
                    : 'Prueba con otro filtro de mood'
                  }
                </p>
              </div>
            );
          }

          return viewMode === 'grid' ? (
            // Vista Grid (Pinterest Style)
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-view-transition">
              {filteredPosts.map((post, index) => {
                const postMood = moods.find(m => m.id === post.mood);
                return (
                  <div 
                    key={post.id} 
                    className={`group relative bg-gray-50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:animate-card-hover border-2 animate-fade-in ${
                      postMood 
                        ? `border-opacity-40 hover:border-opacity-80 ${postMood.color.replace('bg-', 'border-')} hover:${postMood.shadow}` 
                        : 'border-gray-200 hover:border-primary-purple'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setSelectedPost(post);
                      setIsPostDetailOpen(true);
                    }}
                  >
                    {/* Imagen o Placeholder */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className={`w-full h-full ${postMood?.color || 'bg-gray-200'} flex items-center justify-center text-4xl`}>
                          {postMood?.emoji || '📝'}
                        </div>
                      )}
                      
                      {/* Indicador de post destacado */}
                      {post.isHighlighted && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-xs">⭐</span>
                        </div>
                      )}
                      
                      {/* Overlay en Hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 p-4">
                          <h4 className="font-montserrat font-bold text-sm mb-2 truncate">{post.title}</h4>
                          <p className="text-xs opacity-90 truncate font-lato">{post.description}</p>
                          <div className={`mt-3 flex items-center justify-center gap-2 px-3 py-1 rounded-full ${postMood?.color || 'bg-gray-500'} bg-opacity-80`}>
                            <span className="text-lg animate-mood-fade">{postMood?.emoji}</span>
                            <span className="text-xs font-montserrat font-semibold">{postMood?.name}</span>
                          </div>
                          {/* Stats */}
                          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span>❤️</span>
                              <span>{Object.values(post.reactions || {}).flat().length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>💬</span>
                              <span>{post.commentsCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Vista Lista (Instagram Style)
            <div className="space-y-6 animate-view-transition">
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
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
          );
        })()}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        onProfileUpdated={(updatedProfile) => {
          setUserProfile(updatedProfile);
        }}
      />

      {/* Change Photo Modal */}
      <ChangePhotoModal 
        isOpen={isChangePhotoModalOpen}
        onClose={() => setIsChangePhotoModalOpen(false)}
        userProfile={userProfile}
        onPhotoUpdated={(photoURL) => {
          setUserProfile(prev => prev ? { ...prev, photoURL } : null);
        }}
      />

      {/* Mood Journey Modal */}
      <MoodJourneyModal 
        isOpen={isMoodJourneyModalOpen}
        onClose={() => setIsMoodJourneyModalOpen(false)}
        userProfile={userProfile}
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

export default ProfilePage;
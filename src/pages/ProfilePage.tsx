import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Post, UserProfile } from '../types';
import { getUserProfile } from '../services/userService';
import { getPostsByUserId } from '../services/postService';
import PostCard from '../components/PostCard';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('No se ha especificado un ID de usuario.');
      setLoading(false);
      return;
    }

    let unsubscribe = () => {}; // Función vacía para la limpieza

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await getUserProfile(userId);
        if (!profile) {
          setError('Perfil no encontrado.');
        } else {
          setUserProfile(profile);
          // Solo configurar el listener de posts si el perfil existe
          unsubscribe = getPostsByUserId(userId, (posts) => {
            setUserPosts(posts);
          });
        }
      } catch (err) {
        setError('Error al cargar los datos del perfil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Devolver la función de limpieza que se ejecutará al desmontar
    return () => {
      unsubscribe();
    };
  }, [userId]);

  if (loading) return <div className="text-center p-10">Cargando perfil...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!userProfile) return <div className="text-center p-10">Este perfil no existe.</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-white rounded-2xl shadow-sm">
        <img
          src={userProfile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.displayName}`}
          alt={userProfile.displayName || 'Avatar'}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold font-poppins text-neutral-navy">{userProfile.displayName}</h1>
          <p className="text-gray-500">{userProfile.email}</p>
        </div>
      </div>

      <h2 className="text-2xl font-poppins font-bold text-neutral-navy">Publicaciones de {userProfile.displayName}</h2>
      {userPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      ) : <p className="text-center text-gray-500 py-8">Este usuario aún no ha publicado nada.</p>}
    </div>
  );
};

export default ProfilePage;
import React from 'react';

interface User {
  profilePicture: string;
  currentMood: { emoji: string; label: string; color: string };
  fullName: string;
  username: string;
  bio: string;
  location?: string;
  totalPosts: number;
  followers: number;
  following: number;
  moodiaStreak: number;
  isOwnProfile: boolean;
}

const mockUser: User = {
  profilePicture: 'URL_TO_PROFILE_PICTURE',
  currentMood: { emoji: '😄', label: 'Happy', color: 'yellow' },
  fullName: 'John Doe',
  username: '@johndoe',
  bio: 'Software engineer who loves coding and good vibes.',
  location: 'New York',
  totalPosts: 120,
  followers: 250,
  following: 100,
  moodiaStreak: 7,
  isOwnProfile: true,
};

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={mockUser.profilePicture}
          alt="Profile"
          className="rounded-full w-32 h-32 cursor-pointer"
        />
        <div className="mt-2">
          <span
            className="text-xl font-semibold mr-2"
            title={`Today's Mood: ${mockUser.currentMood.label}`}
          >
            {mockUser.currentMood.emoji}
          </span>
          <span className="text-gray-600">{mockUser.currentMood.label}</span>
        </div>
        <h1 className="text-2xl font-bold">{mockUser.fullName}</h1>
        <p className="text-gray-500">{mockUser.username}</p>
        <p className="text-gray-700 mt-2">{mockUser.bio}</p>
        {mockUser.location && <p className="text-gray-600">{mockUser.location}</p>}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
          Compartir perfil
        </button>
      </div>

      {/* Statistics */}
      <div className="flex justify-around mb-6">
        <div>
          <p className="font-bold text-lg">{mockUser.totalPosts}</p>
          <p className="text-gray-600">Posts Totales</p>
        </div>
        <div className="cursor-pointer">
          <p className="font-bold text-lg">{mockUser.followers}</p>
          <p className="text-gray-600">Seguidores</p>
        </div>
        <div className="cursor-pointer">
          <p className="font-bold text-lg">{mockUser.following}</p>
          <p className="text-gray-600">Siguiendo</p>
        </div>
        <div>
          <p className="font-bold text-lg">
            {mockUser.moodiaStreak} {mockUser.moodiaStreak > 0 && '🔥'}
          </p>
          <p className="text-gray-600">Días de Moodia Streak</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Mood Journey
        </button>
      </div>

      {/* Conditional Buttons */}
      <div className="flex justify-center space-x-4">
        {mockUser.isOwnProfile ? (
          <>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Editar Perfil
            </button>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Ajustes
            </button>
          </>
        ) : (
          <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Seguir / Dejar de seguir
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Enviar mensaje
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

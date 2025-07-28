'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Share, Bookmark } from 'lucide-react';
import Header from '@/components/HomePage/Header';
import FooterNav from '@/components/HomePage/FooterNav';

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: 'like',
      user: 'Ana García',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      action: 'reaccionó con 💖 a tu publicación',
      post: 'Mi rutina matutina de meditación',
      time: '2m',
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Carlos López',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      action: 'comentó en tu publicación',
      comment: '¡Increíble proceso! Me inspira mucho tu dedicación 🔥',
      post: 'Deep Work Session',
      time: '15m',
      postImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      type: 'follow',
      user: 'María Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      action: 'comenzó a seguirte',
      time: '1h'
    },
    {
      id: 4,
      type: 'share',
      user: 'Diego Martín',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      action: 'compartió tu publicación',
      post: 'Explorando barrios desconocidos',
      time: '2h',
      postImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop'
    },
    {
      id: 5,
      type: 'like',
      user: 'Sofía Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      action: 'reaccionó con 🤯 a tu publicación',
      post: 'Diseñando mi app soñada',
      time: '3h',
      postImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=100&h=100&fit=crop'
    },
    {
      id: 6,
      type: 'comment',
      user: 'Alejandro Ruiz',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      action: 'comentó en tu publicación',
      comment: 'Tu perspectiva siempre me hace reflexionar. Gracias por ser tan auténtica',
      post: 'Reflexiones sobre el crecimiento',
      time: '5h',
      postImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=100&h=100&fit=crop'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500 fill-current" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share className="w-5 h-5 text-purple-500" />;
      case 'save':
        return <Bookmark className="w-5 h-5 text-yellow-500" />;
      default:
        return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-blue-50 border-blue-200';
      case 'follow':
        return 'bg-green-50 border-green-200';
      case 'share':
        return 'bg-purple-50 border-purple-200';
      case 'save':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Actividad
          </h1>
          <p className="text-gray-600">
            Mantente al día con las interacciones en tus publicaciones
          </p>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad reciente</h2>
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Activity Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* User Avatar */}
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900">
                            <span className="font-semibold">{activity.user}</span>{' '}
                            <span className="text-gray-700">{activity.action}</span>
                          </p>
                          
                          {activity.comment && (
                            <div className="mt-2 p-3 bg-white/70 rounded-xl">
                              <p className="text-sm text-gray-700 italic">"{activity.comment}"</p>
                            </div>
                          )}
                          
                          {activity.post && (
                            <p className="text-sm text-gray-600 mt-1">
                              en "<span className="font-medium">{activity.post}</span>"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                          
                          {activity.postImage && (
                            <img
                              src={activity.postImage}
                              alt="Post"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="p-6 border-t border-gray-100 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Ver más actividad
            </motion.button>
          </div>
        </div>

        {/* Activity Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Reacciones hoy', value: '24', icon: Heart, color: 'text-red-500' },
            { label: 'Comentarios hoy', value: '8', icon: MessageCircle, color: 'text-blue-500' },
            { label: 'Nuevos seguidores', value: '3', icon: UserPlus, color: 'text-green-500' },
            { label: 'Compartidos', value: '5', icon: Share, color: 'text-purple-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <FooterNav />
    </div>
  );
}
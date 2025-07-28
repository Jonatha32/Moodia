'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, MoreHorizontal, Phone, Video } from 'lucide-react';
import Header from '@/components/HomePage/Header';
import FooterNav from '@/components/HomePage/FooterNav';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const conversations = [
    {
      id: 1,
      name: 'Ana García',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Me encantó tu último post sobre meditación 🧘‍♀️',
      time: '2m',
      unread: 2,
      online: true,
      mood: 'reflective'
    },
    {
      id: 2,
      name: 'Carlos López',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lastMessage: '¿Viste el nuevo challenge creativo?',
      time: '15m',
      unread: 0,
      online: true,
      mood: 'creative'
    },
    {
      id: 3,
      name: 'María Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Gracias por la recomendación del libro',
      time: '1h',
      unread: 0,
      online: false,
      mood: 'focus'
    },
    {
      id: 4,
      name: 'Diego Martín',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: '¡Qué aventura increíble! 🏔️',
      time: '3h',
      unread: 1,
      online: false,
      mood: 'explorer'
    }
  ];

  const mockMessages = [
    { id: 1, sender: 'Ana García', message: 'Hola! ¿Cómo estás?', time: '10:30', isMe: false },
    { id: 2, sender: 'Tú', message: '¡Hola Ana! Todo bien, gracias. ¿Y tú?', time: '10:32', isMe: true },
    { id: 3, sender: 'Ana García', message: 'Me encantó tu último post sobre meditación 🧘‍♀️', time: '10:35', isMe: false },
    { id: 4, sender: 'Ana García', message: 'Me ayudó mucho a empezar mi práctica matutina', time: '10:35', isMe: false },
    { id: 5, sender: 'Tú', message: '¡Qué alegría saber eso! La meditación realmente cambia todo', time: '10:40', isMe: true },
    { id: 6, sender: 'Tú', message: 'Si necesitas algún consejo o tienes preguntas, no dudes en escribirme', time: '10:41', isMe: true }
  ];

  const moodColors = {
    focus: '#3A86FF',
    creative: '#FF5E9C',
    explorer: '#00C897',
    reflective: '#9B5DE5',
    chill: '#70D6FF',
    relax: '#D3D3E7',
    motivated: '#FF6B6B'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 cursor-pointer border-b border-gray-50 transition-all ${
                      selectedChat === conversation.id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                        <div 
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-xs"
                          style={{ backgroundColor: moodColors[conversation.mood as keyof typeof moodColors] }}
                        >
                          {conversation.mood === 'focus' && '🎯'}
                          {conversation.mood === 'creative' && '🌈'}
                          {conversation.mood === 'explorer' && '🔍'}
                          {conversation.mood === 'reflective' && '💭'}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-semibold">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={conversations.find(c => c.id === selectedChat)?.avatar}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {conversations.find(c => c.id === selectedChat)?.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {conversations.find(c => c.id === selectedChat)?.online ? 'En línea' : 'Desconectado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Phone className="w-5 h-5 text-gray-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Video className="w-5 h-5 text-gray-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {mockMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.isMe 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.isMe ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        Enviar
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Selecciona una conversación
                    </h3>
                    <p className="text-gray-500">
                      Elige una conversación para empezar a chatear
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterNav />
    </div>
  );
}
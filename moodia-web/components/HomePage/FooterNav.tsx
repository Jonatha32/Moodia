'use client';

import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

export default function FooterNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 md:hidden">
      <div className="flex items-center justify-around py-2">
        <button className="flex flex-col items-center p-3 text-purple-600">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>
        
        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-purple-600 transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Explorar</span>
        </button>
        
        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-purple-600 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs mt-1">Publicar</span>
        </button>
        
        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-purple-600 transition-colors">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Mensajes</span>
        </button>
        
        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-purple-600 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </nav>
  );
}
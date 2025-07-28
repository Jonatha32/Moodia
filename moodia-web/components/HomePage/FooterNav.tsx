'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';

export default function FooterNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Explorar', path: '/search' },
    { icon: Plus, label: 'Publicar', path: '/create', isSpecial: true },
    { icon: MessageCircle, label: 'Mensajes', path: '/messages' },
    { icon: User, label: 'Perfil', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 md:hidden z-50 shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path, isSpecial }) => {
          const isActive = pathname === path;
          
          return (
            <motion.button
              key={path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(path)}
              className="flex flex-col items-center p-3 transition-all duration-200"
            >
              {isSpecial ? (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className={`relative ${
                  isActive ? 'text-purple-600 transform scale-110' : 'text-gray-500 hover:text-purple-600'
                }`}>
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"
                    />
                  )}
                </div>
              )}
              <span className={`text-xs mt-1 transition-colors ${
                isActive ? 'text-purple-600 font-medium' : 'text-gray-500'
              }`}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
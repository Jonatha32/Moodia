import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SettingsDropdown from './SettingsDropdown';
import { useUserProfile } from '../hooks/useUserProfile';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { userProfile } = useUserProfile(currentUser?.uid);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);



  return (
    <div className="min-h-screen bg-neutral-bg">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Moodia Logo" className="h-10 w-auto" />
              <span className="text-2xl font-poppins font-bold text-primary-purple">
                Moodia
              </span>
            </Link>


            
            {currentUser && (
              <div className="flex items-center space-x-6">
                {/* Perfil */}
                <Link 
                  to={`/profile/${currentUser.uid}`} 
                  className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 border-2 border-primary-purple shrink-0"
                >
                  <img
                    src={userProfile?.photoURL || currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.displayName}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </Link>
                
                {/* Cambiar Mood */}
                <button
                  onClick={() => navigate('/select-mood')}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-purple to-primary-coral text-white flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg shrink-0"
                  title="Cambiar Mood"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                {/* Configuraciones */}
                <div className="relative">
                  <button
                    ref={settingsButtonRef}
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shrink-0 ${
                      isSettingsOpen 
                        ? 'bg-primary-purple text-white shadow-primary' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Configuraciones"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  <SettingsDropdown 
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    buttonRef={settingsButtonRef}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className={isSettingsOpen ? 'pointer-events-none' : ''}>
        {children}
      </main>
      
      {/* Overlay cuando el dropdown está abierto */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-white">
      <header className="bg-white shadow-sm border-b border-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Moodia Logo" className="h-10 w-auto" />
              <span className="text-2xl font-poppins font-bold text-primary-purple">
                Moodia
              </span>
            </Link>
            
            {currentUser && (
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${currentUser.uid}`} className="text-sm font-medium text-gray-700 hover:text-primary-purple transition-colors">
                  Hola, {currentUser.displayName || currentUser.email}
                </Link>
                <button
                  onClick={() => navigate('/select-mood')}
                  className="text-sm font-medium text-gray-700 hover:text-primary-purple transition-colors"
                >
                  Cambiar Mood
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
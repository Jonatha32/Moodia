import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({ isOpen, onClose, buttonRef }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-poppins font-bold text-neutral-text text-sm">Configuración</h3>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {/* Configuración de la App */}
        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <p className="font-lato font-medium text-neutral-text text-sm">Configuración</p>
            <p className="font-lato text-xs text-neutral-secondary">Personaliza tu experiencia</p>
          </div>
        </button>

        {/* Dark Mode */}
        <button 
          onClick={toggleDarkMode}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-yellow-100'}`}>
            {darkMode ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-lato font-medium text-neutral-text text-sm">
              {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </p>
            <p className="font-lato text-xs text-neutral-secondary">
              {darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            </p>
          </div>
        </button>

        {/* Notificaciones */}
        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
            </svg>
          </div>
          <div>
            <p className="font-lato font-medium text-neutral-text text-sm">Notificaciones</p>
            <p className="font-lato text-xs text-neutral-secondary">Gestionar alertas</p>
          </div>
        </button>

        {/* Privacidad */}
        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-lato font-medium text-neutral-text text-sm">Privacidad</p>
            <p className="font-lato text-xs text-neutral-secondary">Controla tu información</p>
          </div>
        </button>

        {/* Ayuda */}
        <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-lato font-medium text-neutral-text text-sm">Ayuda y Soporte</p>
            <p className="font-lato text-xs text-neutral-secondary">¿Necesitas ayuda?</p>
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-2"></div>

      {/* Cerrar Sesión */}
      <button 
        onClick={handleSignOut}
        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <div>
          <p className="font-lato font-medium text-red-600 text-sm">Cerrar Sesión</p>
          <p className="font-lato text-xs text-neutral-secondary">Salir de tu cuenta</p>
        </div>
      </button>
    </div>
  );
};

export default SettingsDropdown;
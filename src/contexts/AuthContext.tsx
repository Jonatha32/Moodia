import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { logOut } from '../services/authService';

// Define la forma del valor del contexto
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
}

// Crea el contexto con un valor inicial
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true, logOut: () => Promise.resolve() });

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto que envolverá nuestra aplicación
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es un listener de Firebase que se ejecuta
    // cada vez que el estado de autenticación cambia.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // La carga inicial ha terminado
    });

    // Limpia el listener cuando el componente se desmonta
    return unsubscribe;
  }, []);

  const value = { currentUser, loading, logOut };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
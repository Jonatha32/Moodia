import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Ocurrió un error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-primary border border-gray-100 dark:border-gray-700">
        {/* Logo animado */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Moodia Logo" className="w-20 h-20 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-poppins font-bold text-neutral-text dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-neutral-secondary dark:text-gray-400 font-lato font-light">
            Another day, another mood. Let's share it.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-lato">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-text dark:text-white font-lato">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-text font-lato">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-primary text-base font-semibold text-white gradient-primary hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 transition-all duration-200 font-poppins"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-4 px-6 border border-gray-200 rounded-xl shadow-sm text-base font-medium text-neutral-text bg-white hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all duration-200 font-lato"
          >
            Continuar con Google
          </button>
          
          <div className="text-center">
            <Link
              to="/register"
              className="text-primary-purple hover:text-primary-coral transition-colors text-base font-medium font-lato"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-neutral-secondary font-lato font-light text-sm">
            Made with 💜 from Uruguay
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
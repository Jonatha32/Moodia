import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle } from '../services/authService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Ocurrió un error al iniciar sesión.');
      }
      console.error("Error de inicio de sesión:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('No se pudo iniciar sesión con Google.');
      console.error("Error con Google:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-3xl shadow-primary border border-gray-100">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Moodia Logo" className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-4xl font-poppins font-bold text-neutral-text mb-2">
            Welcome Back
          </h2>
          <p className="text-neutral-secondary font-lato font-light">
            Sign in to continue your journey
          </p>
        </div>
        {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Correo electrónico" 
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Contraseña" 
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <button type="submit" className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-primary text-base font-semibold text-white gradient-primary hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 transition-all duration-200 font-poppins">
            Iniciar Sesión
          </button>
        </form>
        <button onClick={handleGoogleSignIn} className="w-full p-3 mt-4 text-neutral-navy bg-white border border-gray-300 rounded-xl hover:bg-gray-50">Continuar con Google</button>
        <div className="text-center">
          <Link
            to="/register"
            className="text-primary-purple hover:text-primary-coral transition-colors text-base font-medium font-lato"
          >
            ¿No tienes cuenta? Créala aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
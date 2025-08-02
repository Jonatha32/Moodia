import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../services/authService';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(formData.email, formData.password, formData.displayName);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está en uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else {
        setError('Ocurrió un error al crear la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-3xl shadow-primary border border-gray-100">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Moodia Logo" className="w-20 h-20 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-poppins font-bold text-neutral-text mb-2">
            Join Moodia
          </h2>
          <p className="text-neutral-secondary font-lato font-light">
            Start sharing your authentic journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-lato">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-neutral-text font-lato">
              Nombre completo
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-text font-lato">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-text font-lato">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-all duration-200 font-lato"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-primary text-base font-semibold text-white gradient-primary hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple disabled:opacity-50 transition-all duration-200 font-poppins"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-primary-purple hover:text-primary-coral transition-colors text-base font-medium font-lato"
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
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

export default RegisterPage;
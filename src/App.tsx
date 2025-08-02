import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Importa el componente correcto
import { MoodProvider, useMood } from './contexts/MoodContext';
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente correcto
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage'; // Asegúrate de importar la página de registro
import ProfilePage from './pages/ProfilePage';
import MoodSelectorPage from './pages/MoodSelectorPage';

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const { selectedMood } = useMood();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/" /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to="/" /> : <RegisterPage />} 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            {selectedMood ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/select-mood" />
            )}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/select-mood"
        element={
          <ProtectedRoute><MoodSelectorPage /></ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/:userId" 
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <MoodProvider>
        <Router>
          <AppRoutes />
        </Router>
      </MoodProvider>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar un spinner mientras se lee la sesión de localStorage
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Redirigir a login si no hay token de autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar las rutas hijas si está autenticado
  return <Outlet />;
};

export default ProtectedRoute;

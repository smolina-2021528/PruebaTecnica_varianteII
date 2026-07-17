import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Mail, Lock, User } from 'lucide-react';
import { authApi } from '../services/api';
import Alert from '../components/common/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.post('/auth/register', { name, email, password });
      const { success, message } = response.data;
      
      if (success) {
        setSuccess(message || 'Usuario registrado con éxito. Redirigiendo a inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(message || 'Error en el registro');
      }
    } catch (err) {
      console.error('Error de registro:', err);
      const backendMessage = err.response?.data?.message || 'No se pudo conectar con el servidor de autenticación. Verifica que el servicio esté corriendo.';
      setError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-slate-100 dark:border-slate-700 transition-colors">
        {/* Banner de Cabecera */}
        <div className="bg-indigo-600 p-8 text-center relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Crear Cuenta
          </h2>
          <p className="text-indigo-200 text-sm">
            Sistema de Gestión de Inventario Ágil
          </p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && <Alert type="danger" message={error} />}
          {success && <Alert type="success" message={success} />}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="Juan Pérez" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="usuario@empresa.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {isLoading ? 'Creando Cuenta...' : 'Registrarse'}
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
            ¿Ya tienes una cuenta? 
            <Link to="/login" className="ml-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

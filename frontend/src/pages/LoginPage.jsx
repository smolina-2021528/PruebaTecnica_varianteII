import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { authApi } from '../services/api';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Petición real al Servicio Auth
      const response = await authApi.post('/auth/login', { email, password });
      
      const { success, data, message } = response.data;
      
      if (success && data?.token) {
        // Guardar sesión y redirigir
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de login:', err);
      // Extraer mensaje detallado de error del backend si existe
      const backendMessage = err.response?.data?.message || 'No se pudo conectar con el servidor de autenticación. Verifica que el servicio esté corriendo.';
      setError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-200">
      <Card className="w-full max-w-md" title="Iniciar Sesión">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <Alert type="danger" message={error} />}
          
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Ingresar
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">¿No tienes una cuenta? </span>
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

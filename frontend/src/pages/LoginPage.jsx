import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Simulación de respuesta de API (Sprint 1)
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'demo@example.com' && password === '123456') {
        login('mock-jwt-token', { name: 'Leonel Líder', email: 'demo@example.com' });
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Use: demo@example.com y 123456');
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-200">
      <Card className="w-full max-w-md" title="Iniciar Sesión">
        <p className="text-xs text-slate-500 mb-4 dark:text-slate-400">
          Usa las credenciales de prueba para el Sprint 1: <br />
          <strong>Email:</strong> demo@example.com / <strong>Contraseña:</strong> 123456
        </p>

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

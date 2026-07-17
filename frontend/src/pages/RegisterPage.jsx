import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulación de registro de API (Sprint 1)
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Usuario registrado con éxito. Redirigiendo a inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-200">
      <Card className="w-full max-w-md" title="Registrarse">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          {success && <Alert type="success" message={success} />}
          
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Crear cuenta
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-slate-500 dark:text-slate-400">¿Ya tienes una cuenta? </span>
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicialización de la sesión leyendo de localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('inventory_token');
    const storedUser = localStorage.getItem('inventory_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // En caso de JSON corrupto, limpiar sesión
        localStorage.removeItem('inventory_token');
        localStorage.removeItem('inventory_user');
      }
    }
    setLoading(false);
  }, []);

  // Función de inicio de sesión
  const login = (newToken, newUser) => {
    localStorage.setItem('inventory_token', newToken);
    localStorage.setItem('inventory_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Función de cierre de sesión
  const logout = () => {
    localStorage.removeItem('inventory_token');
    localStorage.removeItem('inventory_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

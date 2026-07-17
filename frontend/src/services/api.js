import axios from 'axios';

// Obtener las URLs de los microservicios desde las variables de entorno
const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4001/api';
const INVENTORY_URL = import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:4002/api';
const REPORTS_URL = import.meta.env.VITE_REPORTS_API_URL || 'http://localhost:4003/api';

// 1. Cliente Axios para el Servicio Auth (Autenticación)
export const authApi = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Cliente Axios para el Servicio Inventory (Inventario: Productos y Movimientos)
export const inventoryApi = axios.create({
  baseURL: INVENTORY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Cliente Axios para el Servicio Reports (Alertas y Reportes)
export const reportsApi = axios.create({
  baseURL: REPORTS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el JWT token en cada petición saliente a Inventory y Reports
const addTokenInterceptor = (config) => {
  const token = localStorage.getItem('inventory_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

inventoryApi.interceptors.request.use(addTokenInterceptor, (error) => Promise.reject(error));
reportsApi.interceptors.request.use(addTokenInterceptor, (error) => Promise.reject(error));

// Interceptor para manejar respuestas fallidas (Error 401 - Sesión Expirada)
const handle401Interceptor = (error) => {
  if (error.response && error.response.status === 401) {
    // Si la sesión expiró o es inválida, limpiamos credenciales locales
    localStorage.removeItem('inventory_token');
    localStorage.removeItem('inventory_user');
    
    // Redirigir a login si no estamos ya en esa pantalla para evitar bucles de recarga
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
};

inventoryApi.interceptors.response.use(
  (response) => response,
  handle401Interceptor
);

reportsApi.interceptors.response.use(
  (response) => response,
  handle401Interceptor
);

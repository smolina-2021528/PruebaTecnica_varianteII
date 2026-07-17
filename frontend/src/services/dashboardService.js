import { reportsApi } from './api';

// Obtener el resumen general del inventario
export const getSummary = async () => {
  const response = await reportsApi.get('/reports/summary');
  // Devolvemos el objeto 'data' de la respuesta estándar del backend
  return response.data.data || {};
};

// Obtener la lista de productos con stock bajo
export const getLowStock = async () => {
  const response = await reportsApi.get('/alerts/low-stock');
  // Devolvemos la lista de productos
  return response.data.data?.products || [];
};

// Obtener la lista de productos agotados (stock 0)
export const getOutOfStock = async () => {
  const response = await reportsApi.get('/alerts/out-of-stock');
  // Devolvemos la lista de productos
  return response.data.data?.products || [];
};

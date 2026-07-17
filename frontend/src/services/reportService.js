import { reportsApi } from './api';

// Obtener los productos más vendidos (ordenados por total de unidades de salida)
export const getTopProducts = async () => {
  const response = await reportsApi.get('/reports/top-products');
  return response.data.data?.products || [];
};

// Obtener la distribución de productos y existencias por categoría
export const getCategoriesReport = async () => {
  const response = await reportsApi.get('/reports/categories');
  return response.data.data?.categories || [];
};

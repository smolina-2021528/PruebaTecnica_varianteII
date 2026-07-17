import { inventoryApi } from './api';

// --- PRODUCTOS ---

// Listar productos (con filtros opcionales de búsqueda y categoría)
export const getProducts = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  
  const response = await inventoryApi.get('/products', { params });
  return response.data.data?.products || [];
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  const response = await inventoryApi.post('/products', productData);
  return response.data.data || response.data;
};

// Editar un producto existente
export const updateProduct = async (id, productData) => {
  const response = await inventoryApi.put(`/products/${id}`, productData);
  return response.data.data || response.data;
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  const response = await inventoryApi.delete(`/products/${id}`);
  return response.data;
};

// --- CATEGORÍAS ---

// Listar categorías
export const getCategories = async () => {
  const response = await inventoryApi.get('/categories');
  return response.data.data?.categories || [];
};

// Crear una categoría
export const createCategory = async (categoryData) => {
  const response = await inventoryApi.post('/categories', categoryData);
  return response.data.data || response.data;
};

// Eliminar una categoría
export const deleteCategory = async (id) => {
  const response = await inventoryApi.delete(`/categories/${id}`);
  return response.data;
};

// --- TRANSACCIONES / MOVIMIENTOS ---

// Registrar entrada de stock
export const registerEntry = async (productId, quantity) => {
  const response = await inventoryApi.post('/entries', { productId, quantity });
  return response.data;
};

// Registrar salida de stock
export const registerOutput = async (productId, quantity) => {
  const response = await inventoryApi.post('/outputs', { productId, quantity });
  return response.data;
};

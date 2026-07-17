import { inventoryApi } from './api';

export const getProducts = async (params = {}) => {
  const response = await inventoryApi.get('/products', { params });
  return response.data.data.products;
};

export const getProductById = async (id) => {
  const response = await inventoryApi.get(`/products/${id}`);
  return response.data.data.product;
};

export const createProduct = async (productData) => {
  const response = await inventoryApi.post('/products', productData);
  return response.data.data.product;
};

export const updateProduct = async (id, productData) => {
  const response = await inventoryApi.put(`/products/${id}`, productData);
  return response.data.data.product;
};

export const deleteProduct = async (id) => {
  const response = await inventoryApi.delete(`/products/${id}`);
  return response.data.data.product;
};

import { inventoryApi } from './api';

export const getCategories = async () => {
  const response = await inventoryApi.get('/categories');
  return response.data.data.categories;
};

export const createCategory = async (name) => {
  const response = await inventoryApi.post('/categories', { name });
  return response.data.data.category;
};

export const deleteCategory = async (id) => {
  const response = await inventoryApi.delete(`/categories/${id}`);
  return response.data.data.category;
};

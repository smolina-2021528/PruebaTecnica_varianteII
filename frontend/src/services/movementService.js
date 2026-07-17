import { inventoryApi } from './api';

export const getMovements = async (filters = {}) => {
  const params = {};

  if (filters.type) {
    params.type = filters.type;
  }

  if (filters.productId) {
    params.productId = filters.productId;
  }

  const response = await inventoryApi.get('/movements', { params });

  return response.data.data?.movements || [];
};

export const createEntry = async ({ productId, quantity }) => {
  const response = await inventoryApi.post('/entries', {
    productId,
    quantity,
  });

  return response.data.data || response.data;
};

export const createOutput = async ({ productId, quantity }) => {
  const response = await inventoryApi.post('/outputs', {
    productId,
    quantity,
  });

  return response.data.data || response.data;
};
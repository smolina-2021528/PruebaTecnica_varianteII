import axios from 'axios';
import { env } from '../config/env.js';

const inventoryApi = axios.create({
  baseURL: env.inventoryServiceUrl,
  timeout: 5000,
});

export async function getInventoryProducts(authorizationHeader) {
  const response = await inventoryApi.get('/api/products', {
    headers: {
      Authorization: authorizationHeader,
    },
  });

  const products = response.data?.data?.products;

  if (!Array.isArray(products)) {
    const error = new Error(
      'Inventory no respondió con una lista válida de productos',
    );

    error.status = 502;

    throw error;
  }

  return products;
}
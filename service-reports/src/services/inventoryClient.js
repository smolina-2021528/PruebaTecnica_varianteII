import axios from 'axios';
import { env } from '../config/env.js';

const inventoryApi = axios.create({
  baseURL: env.inventoryServiceUrl,
  timeout: 5000,
});

function buildAuthorizationHeaders(authorizationHeader) {
  return {
    Authorization: authorizationHeader,
  };
}

function createInvalidInventoryResponseError(message) {
  const error = new Error(message);

  error.status = 502;
  error.errors = [
    {
      service: 'Inventory',
      detail: message,
    },
  ];

  return error;
}

export async function getInventoryProducts(authorizationHeader) {
  const response = await inventoryApi.get('/api/products', {
    headers: buildAuthorizationHeaders(authorizationHeader),
  });

  const products = response.data?.data?.products;

  if (!Array.isArray(products)) {
    throw createInvalidInventoryResponseError(
      'Inventory no respondió con una lista válida de productos',
    );
  }

  return products;
}

export async function getInventoryMovements(authorizationHeader) {
  const response = await inventoryApi.get('/api/movements', {
    headers: buildAuthorizationHeaders(authorizationHeader),
  });

  const movements = response.data?.data?.movements;

  if (!Array.isArray(movements)) {
    throw createInvalidInventoryResponseError(
      'Inventory no respondió con una lista válida de movimientos',
    );
  }

  return movements;
}
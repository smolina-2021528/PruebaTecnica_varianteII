import { sendError } from '../utils/httpResponse.js';

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  return sendError(res, {
    status: error.status || 500,
    message: error.message || 'Error interno del servidor',
    errors: error.errors || [],
  });
}
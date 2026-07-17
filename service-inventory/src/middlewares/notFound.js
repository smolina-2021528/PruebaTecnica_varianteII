import { sendError } from '../utils/httpResponse.js';

export function notFound(req, res) {
  return sendError(res, {
    status: 404,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}
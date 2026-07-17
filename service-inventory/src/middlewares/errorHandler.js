import { sendError } from '../utils/httpResponse.js';

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  // Validaciones de esquema de Mongoose (nombre/categoría obligatorios, precio < 0, etc.)
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((e) => e.message);

    return sendError(res, {
      status: 400,
      message: 'Datos inválidos',
      errors,
    });
  }

  // ObjectId con formato incorrecto (por ejemplo en :id de la URL).
  if (error.name === 'CastError') {
    return sendError(res, {
      status: 400,
      message: 'Identificador no válido',
      errors: [],
    });
  }

  // Violación de índice único (por ejemplo categoría duplicada).
  if (error.code === 11000) {
    return sendError(res, {
      status: 409,
      message: 'El recurso ya existe',
      errors: [],
    });
  }

  return sendError(res, {
    status: error.status || 500,
    message: error.message || 'Error interno del servidor',
    errors: error.errors || [],
  });
}
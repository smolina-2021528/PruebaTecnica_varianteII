import { sendError } from '../utils/httpResponse.js';

function getDuplicateField(error) {
  const field = Object.keys(error.keyValue || {})[0];

  if (!field) {
    return 'El recurso';
  }

  const readableFields = {
    name: 'El nombre',
    email: 'El correo',
    category: 'La categoría',
  };

  return readableFields[field] || `El campo ${field}`;
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));

    return sendError(res, {
      status: 400,
      message: 'Datos inválidos',
      errors,
    });
  }

  if (error.name === 'CastError') {
    return sendError(res, {
      status: 400,
      message: 'Identificador no válido',
      errors: [
        {
          field: error.path,
          value: error.value,
        },
      ],
    });
  }

  if (error.code === 11000) {
    return sendError(res, {
      status: 409,
      message: `${getDuplicateField(error)} ya existe`,
      errors: [
        {
          field: Object.keys(error.keyValue || {})[0],
          value: Object.values(error.keyValue || {})[0],
        },
      ],
    });
  }

  return sendError(res, {
    status: error.status || 500,
    message: error.message || 'Error interno del servidor',
    errors: error.errors || [],
  });
}
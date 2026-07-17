export function sendSuccess(
  res,
  { status = 200, message = 'OperaciÃ³n realizada', data = {} } = {},
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res,
  { status = 500, message = 'Error interno del servidor', errors = [] } = {},
) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}
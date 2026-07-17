// Envuelve un controlador async y reenvía cualquier error a errorHandler
// mediante next(), evitando repetir try/catch en cada controlador.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

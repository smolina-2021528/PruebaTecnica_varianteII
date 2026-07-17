// Error simple con status HTTP, compatible con errorHandler
// (que lee error.status, error.message y error.errors).
export class HttpError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

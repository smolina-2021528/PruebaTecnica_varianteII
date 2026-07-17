import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/httpResponse.js';

export function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return sendError(res, {
      status: 401,
      message: 'Token ausente',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    return next();
  } catch {
    return sendError(res, {
      status: 401,
      message: 'Token inválido o expirado',
    });
  }
}
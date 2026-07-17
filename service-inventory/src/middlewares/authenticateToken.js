import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/httpResponse.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, { status: 401, message: 'Token ausente' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    return sendError(res, { status: 401, message: 'Token inválido o expirado' });
  }
}
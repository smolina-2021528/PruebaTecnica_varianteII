import argon2 from 'argon2';
import { User } from '../models/User.js';
import { generateAuthToken } from '../utils/jwt.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';

    const errors = [];

    if (!normalizedName || normalizedName.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      errors.push('El correo no tiene un formato válido');
    }

    if (typeof password !== 'string' || password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (errors.length > 0) {
      return sendError(res, {
        status: 400,
        message: 'Datos inválidos',
        errors,
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return sendError(res, {
        status: 409,
        message: 'El correo ya está registrado',
      });
    }

    const passwordHash = await argon2.hash(password);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });

    return sendSuccess(res, {
      status: 201,
      message: 'Usuario registrado',
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';

    const errors = [];

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      errors.push('El correo no tiene un formato válido');
    }

    if (typeof password !== 'string' || password.length < 1) {
      errors.push('La contraseña es obligatoria');
    }

    if (errors.length > 0) {
      return sendError(res, {
        status: 400,
        message: 'Datos inválidos',
        errors,
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+passwordHash');

    if (!user) {
      return sendError(res, {
        status: 401,
        message: 'Credenciales inválidas',
      });
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      password,
    );

    if (!passwordMatches) {
      return sendError(res, {
        status: 401,
        message: 'Credenciales inválidas',
      });
    }

    const token = generateAuthToken(user);

    return sendSuccess(res, {
      status: 200,
      message: 'Inicio de sesión correcto',
      data: {
        token,
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    return next(error);
  }
}
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function validateObjectId(id, message = 'El identificador del producto no es válido') {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, message);
  }
}

function normalizeRequiredString(value, fieldName) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue) {
    throw new HttpError(400, `${fieldName} es obligatorio`);
  }

  return normalizedValue;
}

function parseNonNegativeNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new HttpError(400, `${fieldName} debe ser un número mayor o igual a 0`);
  }

  return number;
}

function parseNonNegativeInteger(value, fieldName) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new HttpError(400, `${fieldName} debe ser un entero mayor o igual a 0`);
  }

  return number;
}

function buildProductPayload(body, { isUpdate = false } = {}) {
  const payload = {
    name: normalizeRequiredString(body.name, 'El nombre'),
    category: normalizeRequiredString(body.category, 'La categoría'),
    price: parseNonNegativeNumber(body.price, 'El precio'),
    minStock: parseNonNegativeInteger(
      body.minStock ?? 5,
      'El stock mínimo',
    ),
  };

  if (!isUpdate) {
    payload.stock = parseNonNegativeInteger(
      body.stock ?? 0,
      'El stock inicial',
    );
  }

  return payload;
}

export const createProduct = asyncHandler(async (req, res) => {
  const productPayload = buildProductPayload(req.body);

  const product = await Product.create(productPayload);

  return sendSuccess(res, {
    status: 201,
    message: 'Producto creado correctamente',
    data: { product },
  });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;

  const filter = {};

  if (search && String(search).trim()) {
    filter.name = {
      $regex: String(search).trim(),
      $options: 'i',
    };
  }

  if (category && String(category).trim()) {
    filter.category = String(category).trim();
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return sendSuccess(res, {
    message: 'Productos obtenidos',
    data: { products },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const product = await Product.findById(id);

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return sendSuccess(res, {
    message: 'Producto obtenido',
    data: { product },
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const productPayload = buildProductPayload(req.body, { isUpdate: true });

  const product = await Product.findByIdAndUpdate(
    id,
    productPayload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return sendSuccess(res, {
    message: 'Producto actualizado correctamente',
    data: { product },
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return sendSuccess(res, {
    message: 'Producto eliminado correctamente',
    data: { product },
  });
});
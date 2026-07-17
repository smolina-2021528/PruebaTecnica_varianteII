import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Movement } from '../models/Movement.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function validateProductId(productId) {
  if (!mongoose.isValidObjectId(productId)) {
    throw new HttpError(400, 'ID de producto inválido');
  }
}

function parsePositiveIntegerQuantity(value) {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, 'La cantidad debe ser un entero mayor a 0');
  }

  return quantity;
}

function normalizeMovementType(type) {
  const normalizedType = String(type || '').toUpperCase();

  if (!['ENTRY', 'OUTPUT'].includes(normalizedType)) {
    throw new HttpError(400, 'Tipo de movimiento inválido');
  }

  return normalizedType;
}

export const createEntry = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const quantity = parsePositiveIntegerQuantity(req.body.quantity);

  validateProductId(productId);

  const product = await Product.findById(productId);

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  const previousStock = Number(product.stock);
  const newStock = previousStock + quantity;

  product.stock = newStock;
  await product.save();

  const movement = await Movement.create({
    productId,
    productName: product.name,
    type: 'ENTRY',
    quantity,
    previousStock,
    newStock,
  });

  return sendSuccess(res, {
    status: 201,
    message: 'Entrada registrada',
    data: { movement, product },
  });
});

export const createOutput = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const quantity = parsePositiveIntegerQuantity(req.body.quantity);

  validateProductId(productId);

  const product = await Product.findById(productId);

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  const previousStock = Number(product.stock);

  if (previousStock < quantity) {
    throw new HttpError(400, 'Stock insuficiente');
  }

  const newStock = previousStock - quantity;

  product.stock = newStock;
  await product.save();

  const movement = await Movement.create({
    productId,
    productName: product.name,
    type: 'OUTPUT',
    quantity,
    previousStock,
    newStock,
  });

  return sendSuccess(res, {
    status: 201,
    message: 'Salida registrada',
    data: { movement, product },
  });
});

export const listMovements = asyncHandler(async (req, res) => {
  const { type, productId } = req.query;
  const filter = {};

  if (type) {
    filter.type = normalizeMovementType(type);
  }

  if (productId) {
    validateProductId(productId);
    filter.productId = productId;
  }

  const movements = await Movement.find(filter).sort({ createdAt: -1 });

  return sendSuccess(res, {
    message: 'Movimientos obtenidos',
    data: { movements },
  });
});
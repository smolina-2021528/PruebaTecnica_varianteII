import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock = 0, minStock = 5 } = req.body;

  const product = await Product.create({
    name,
    category,
    price,
    stock,
    minStock,
  });

  return sendSuccess(res, {
    status: 201,
    message: 'Producto creado correctamente',
    data: { product },
  });
});

// GET /api/products?search=texto&category=nombre
export const listProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' }; // case insensitive
  }

  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  return sendSuccess(res, {
    message: 'Productos obtenidos',
    data: { products },
  });
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'El identificador del producto no es válido');
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return sendSuccess(res, {
    message: 'Producto obtenido',
    data: { product },
  });
});

// PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, price, minStock } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'El identificador del producto no es válido');
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { name, category, price, minStock },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return sendSuccess(res, {
    message: 'Producto actualizado correctamente',
    data: { product },
  });
});

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'El identificador del producto no es válido');
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }

  return sendSuccess(res, {
    message: 'Producto eliminado correctamente',
    data: { product },
  });
});
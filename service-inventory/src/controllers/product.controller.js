import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock, minStock } = req.body;

  const product = await Product.create({
    name,
    category,
    price,
    stock,
    minStock,
  });

  return sendSuccess(res, {
    status: 201,
    message: 'Producto creado',
    data: { product },
  });
});

// GET /api/products?search=texto&category=nombre
export const listProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;

  const filter = {};

  if (search) {
    // Búsqueda por nombre, ignorando mayúsculas/minúsculas.
    filter.name = { $regex: search, $options: 'i' };
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

import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function normalizeCategoryName(name) {
  return String(name || '').trim();
}

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  return sendSuccess(res, {
    message: 'Categorías obtenidas',
    data: { categories },
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const name = normalizeCategoryName(req.body.name);

  if (!name) {
    throw new HttpError(400, 'El nombre de la categoría es obligatorio');
  }

  const category = await Category.create({ name });

  return sendSuccess(res, {
    status: 201,
    message: 'Categoría creada',
    data: { category },
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'ID de categoría inválido');
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new HttpError(404, 'Categoría no encontrada');
  }

  const productUsingCategory = await Product.exists({
    category: category.name,
  });

  if (productUsingCategory) {
    throw new HttpError(
      400,
      'No se puede eliminar una categoría que está siendo utilizada por productos',
    );
  }

  await category.deleteOne();

  return sendSuccess(res, {
    message: 'Categoría eliminada',
    data: { category },
  });
});
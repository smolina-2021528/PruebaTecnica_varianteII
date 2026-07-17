import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    return sendSuccess(res, { message: 'Categorías obtenidas', data: { categories } });
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({ name });
    return sendSuccess(res, {
        status: 201,
        message: 'Categoría creada',
        data: { category }
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        throw new HttpError(400, 'ID de categoría inválido');
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new HttpError(404, 'Categoría no encontrada');

    return sendSuccess(res, { message: 'Categoría eliminada', data: { category } });
});
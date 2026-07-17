import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Movement } from '../models/Movement.js';
import { sendSuccess } from '../utils/httpResponse.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createEntry = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!mongoose.isValidObjectId(productId)) throw new HttpError(400, 'ID inválido');
    if (quantity <= 0) throw new HttpError(400, 'Cantidad debe ser mayor a 0');

    const product = await Product.findById(productId);
    if (!product) throw new HttpError(404, 'Producto no encontrado');

    const previousStock = product.stock;
    const newStock = previousStock + quantity;

    product.stock = newStock;
    await product.save();

    const movement = await Movement.create({
        productId, productName: product.name, type: 'ENTRY',
        quantity, previousStock, newStock
    });

    return sendSuccess(res, {
        status: 201,
        message: 'Entrada registrada',
        data: { movement, product }
    });
});

export const createOutput = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!mongoose.isValidObjectId(productId)) throw new HttpError(400, 'ID inválido');
    if (quantity <= 0) throw new HttpError(400, 'Cantidad debe ser mayor a 0');

    const product = await Product.findById(productId);
    if (!product) throw new HttpError(404, 'Producto no encontrado');
    if (product.stock < quantity) throw new HttpError(400, 'Stock insuficiente');

    const previousStock = product.stock;
    const newStock = previousStock - quantity;

    product.stock = newStock;
    await product.save();

    const movement = await Movement.create({
        productId, productName: product.name, type: 'OUTPUT',
        quantity, previousStock, newStock
    });

    return sendSuccess(res, {
        status: 201,
        message: 'Salida registrada',
        data: { movement, product }
    });
});

export const listMovements = asyncHandler(async (req, res) => {
    const { type, productId } = req.query;
    const filter = {};

    if (type) filter.type = type.toUpperCase();
    if (productId) {
        if (!mongoose.isValidObjectId(productId)) throw new HttpError(400, 'ID inválido');
        filter.productId = productId;
    }

    const movements = await Movement.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, { message: 'Movimientos obtenidos', data: { movements } });
});
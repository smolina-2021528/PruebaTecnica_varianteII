import { getInventoryProducts } from '../services/inventoryClient.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function normalizeProductForAlert(product) {
  return {
    _id: product._id,
    name: product.name,
    category: product.category,
    price: toFiniteNumber(product.price),
    stock: toFiniteNumber(product.stock),
    minStock: toFiniteNumber(product.minStock, 5),
  };
}

function isLowStockProduct(product) {
  const stock = toFiniteNumber(product.stock);
  const minStock = toFiniteNumber(product.minStock, 5);

  return stock > 0 && stock <= minStock;
}

function isOutOfStockProduct(product) {
  const stock = toFiniteNumber(product.stock);

  return stock === 0;
}

function handleInventoryError(error, res, defaultMessage) {
  if (error.response) {
    return sendError(res, {
      status: 502,
      message: defaultMessage,
      errors: [
        {
          service: 'Inventory',
          status: error.response.status,
          detail:
            error.response.data?.message ||
            'Respuesta inválida desde Inventory',
        },
      ],
    });
  }

  if (error.status === 502) {
    return sendError(res, {
      status: 502,
      message: error.message,
      errors: error.errors || [],
    });
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return sendError(res, {
      status: 502,
      message: 'Inventory no está disponible',
      errors: [
        {
          service: 'Inventory',
          detail: error.message,
        },
      ],
    });
  }

  return null;
}

export async function getLowStockAlert(req, res, next) {
  try {
    const products = await getInventoryProducts(req.headers.authorization);

    const lowStockProducts = products
      .filter(isLowStockProduct)
      .map(normalizeProductForAlert);

    return sendSuccess(res, {
      message: 'Productos con bajo inventario',
      data: {
        count: lowStockProducts.length,
        products: lowStockProducts,
      },
    });
  } catch (error) {
    const handledError = handleInventoryError(
      error,
      res,
      'No fue posible consultar Inventory para calcular bajo inventario',
    );

    if (handledError) {
      return handledError;
    }

    return next(error);
  }
}

export async function getOutOfStockAlert(req, res, next) {
  try {
    const products = await getInventoryProducts(req.headers.authorization);

    const outOfStockProducts = products
      .filter(isOutOfStockProduct)
      .map(normalizeProductForAlert);

    return sendSuccess(res, {
      message: 'Productos agotados',
      data: {
        count: outOfStockProducts.length,
        products: outOfStockProducts,
      },
    });
  } catch (error) {
    const handledError = handleInventoryError(
      error,
      res,
      'No fue posible consultar Inventory para calcular productos agotados',
    );

    if (handledError) {
      return handledError;
    }

    return next(error);
  }
}
import {
  getInventoryMovements,
  getInventoryProducts,
} from '../services/inventoryClient.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function getProductId(value) {
  if (!value) {
    return 'unknown-product';
  }

  if (typeof value === 'object' && value._id) {
    return String(value._id);
  }

  return String(value);
}

function getProductName(movement) {
  return (
    movement.productName ||
    movement.name ||
    movement.product?.name ||
    'Producto sin nombre'
  );
}

function isOutputMovement(movement) {
  return String(movement.type || '').toUpperCase() === 'OUTPUT';
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

export async function getTopProductsReport(req, res, next) {
  try {
    const movements = await getInventoryMovements(
      req.headers.authorization,
    );

    const groupedProducts = movements
      .filter(isOutputMovement)
      .reduce((accumulator, movement) => {
        const productId = getProductId(movement.productId);
        const quantity = toFiniteNumber(movement.quantity);

        if (quantity <= 0) {
          return accumulator;
        }

        if (!accumulator.has(productId)) {
          accumulator.set(productId, {
            productId,
            name: getProductName(movement),
            totalSold: 0,
          });
        }

        const currentProduct = accumulator.get(productId);
        currentProduct.totalSold += quantity;

        return accumulator;
      }, new Map());

    const products = Array.from(groupedProducts.values()).sort(
      (firstProduct, secondProduct) =>
        secondProduct.totalSold - firstProduct.totalSold,
    );

    return sendSuccess(res, {
      message: 'Productos más vendidos',
      data: {
        products,
      },
    });
  } catch (error) {
    const handledError = handleInventoryError(
      error,
      res,
      'No fue posible consultar Inventory para calcular productos más vendidos',
    );

    if (handledError) {
      return handledError;
    }

    return next(error);
  }
}

export async function getCategoriesReport(req, res, next) {
  try {
    const products = await getInventoryProducts(req.headers.authorization);

    const groupedCategories = products.reduce((accumulator, product) => {
      const category = product.category || 'Sin categoría';
      const stock = toFiniteNumber(product.stock);
      const price = toFiniteNumber(product.price);

      if (!accumulator.has(category)) {
        accumulator.set(category, {
          category,
          productCount: 0,
          totalUnits: 0,
          inventoryValue: 0,
        });
      }

      const currentCategory = accumulator.get(category);
      currentCategory.productCount += 1;
      currentCategory.totalUnits += stock;
      currentCategory.inventoryValue += price * stock;

      return accumulator;
    }, new Map());

    const categories = Array.from(groupedCategories.values()).sort(
      (firstCategory, secondCategory) =>
        firstCategory.category.localeCompare(secondCategory.category),
    );

    return sendSuccess(res, {
      message: 'Resumen por categorías',
      data: {
        categories,
      },
    });
  } catch (error) {
    const handledError = handleInventoryError(
      error,
      res,
      'No fue posible consultar Inventory para calcular resumen por categorías',
    );

    if (handledError) {
      return handledError;
    }

    return next(error);
  }
}

export async function getSummaryReport(req, res, next) {
  try {
    const products = await getInventoryProducts(req.headers.authorization);

    const summary = products.reduce(
      (accumulator, product) => {
        const stock = toFiniteNumber(product.stock);
        const price = toFiniteNumber(product.price);

        accumulator.totalProducts += 1;
        accumulator.totalUnits += stock;
        accumulator.inventoryValue += price * stock;

        if (isLowStockProduct(product)) {
          accumulator.lowStockCount += 1;
        }

        if (isOutOfStockProduct(product)) {
          accumulator.outOfStockCount += 1;
        }

        return accumulator;
      },
      {
        totalProducts: 0,
        totalUnits: 0,
        inventoryValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      },
    );

    return sendSuccess(res, {
      message: 'Resumen general de inventario',
      data: summary,
    });
  } catch (error) {
    const handledError = handleInventoryError(
      error,
      res,
      'No fue posible consultar Inventory para calcular resumen general',
    );

    if (handledError) {
      return handledError;
    }

    return next(error);
  }
}
import { getInventoryProducts } from '../services/inventoryClient.js';
import { sendError, sendSuccess } from '../utils/httpResponse.js';

function isLowStockProduct(product) {
  const stock = Number(product.stock);
  const minStock = Number(product.minStock ?? 5);

  return Number.isFinite(stock)
    && Number.isFinite(minStock)
    && stock > 0
    && stock <= minStock;
}

export async function getLowStockAlert(req, res, next) {
  try {
    const products = await getInventoryProducts(
      req.headers.authorization,
    );

    const lowStockProducts = products.filter(isLowStockProduct);

    return sendSuccess(res, {
      message: 'Productos con bajo inventario',
      data: {
        count: lowStockProducts.length,
        products: lowStockProducts,
      },
    });
  } catch (error) {
    if (error.response) {
      return sendError(res, {
        status: 502,
        message:
          'No fue posible consultar Inventory para calcular bajo inventario',
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

    return next(error);
  }
}
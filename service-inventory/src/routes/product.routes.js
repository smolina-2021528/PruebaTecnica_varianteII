import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Proteger todas las rutas de productos con JWT (Sprint 2)
router.use(authenticateToken);

router.post('/', createProduct);
router.get('/', listProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
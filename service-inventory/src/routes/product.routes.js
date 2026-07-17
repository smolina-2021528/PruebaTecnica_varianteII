import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProductById,
} from '../controllers/product.controller.js';

const router = Router();

// Sprint 1: sin JWT todavía (se protegerá antes de cerrar Sprint 2).
router.post('/', createProduct);
router.get('/', listProducts);
router.get('/:id', getProductById);

export default router;

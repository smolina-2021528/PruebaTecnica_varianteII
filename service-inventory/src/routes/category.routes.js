import { Router } from 'express';
import {
  listCategories,
  createCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Proteger todas las rutas de categorías con JWT
router.use(authenticateToken);

router.get('/', listCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;
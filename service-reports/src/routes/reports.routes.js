import { Router } from 'express';
import {
  getCategoriesReport,
  getSummaryReport,
  getTopProductsReport,
} from '../controllers/reports.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

router.get('/top-products', authenticateToken, getTopProductsReport);
router.get('/categories', authenticateToken, getCategoriesReport);
router.get('/summary', authenticateToken, getSummaryReport);

export default router;
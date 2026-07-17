import { Router } from 'express';
import {
  getLowStockAlert,
  getOutOfStockAlert,
} from '../controllers/alerts.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

router.get('/low-stock', authenticateToken, getLowStockAlert);
router.get('/out-of-stock', authenticateToken, getOutOfStockAlert);

export default router;
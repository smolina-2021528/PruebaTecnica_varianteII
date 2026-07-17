import { Router } from 'express';
import { getLowStockAlert } from '../controllers/alerts.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

router.get('/low-stock', authenticateToken, getLowStockAlert);

export default router;
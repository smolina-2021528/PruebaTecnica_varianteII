import { Router } from 'express';
import {
  createEntry,
  createOutput,
  listMovements,
} from '../controllers/movement.controller.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Proteger todas las rutas de movimientos con JWT
router.use(authenticateToken);

router.post('/entries', createEntry);
router.post('/outputs', createOutput);
router.get('/movements', listMovements);

export default router;

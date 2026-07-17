import { Router } from 'express';
import { sendSuccess } from '../utils/httpResponse.js';

const router = Router();

router.get('/', (_req, res) =>
  sendSuccess(res, {
    message: 'service-inventory disponible',
    data: {
      service: 'service-inventory',
      status: 'ok',
    },
  }),
);

export default router;
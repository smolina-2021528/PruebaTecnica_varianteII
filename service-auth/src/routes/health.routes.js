import { Router } from 'express';
import { sendSuccess } from '../utils/httpResponse.js';

const router = Router();

router.get('/', (_req, res) =>
  sendSuccess(res, {
    message: 'service-auth disponible',
    data: {
      service: 'service-auth',
      status: 'ok',
    },
  }),
);

export default router;
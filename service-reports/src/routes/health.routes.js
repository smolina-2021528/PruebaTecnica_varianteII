import { Router } from 'express';
import { sendSuccess } from '../utils/httpResponse.js';

const router = Router();

router.get('/', (_req, res) =>
  sendSuccess(res, {
    message: 'service-reports disponible',
    data: {
      service: 'service-reports',
      status: 'ok',
    },
  }),
);

export default router;
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import alertsRoutes from './routes/alerts.routes.js';
import healthRoutes from './routes/health.routes.js';
import reportsRoutes from './routes/reports.routes.js';

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
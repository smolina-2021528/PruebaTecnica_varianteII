import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

import healthRoutes from './routes/health.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import movementRoutes from './routes/movement.routes.js';

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());

// Rutas públicas
app.use('/api/health', healthRoutes);

// Rutas protegidas
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', movementRoutes);   // /api/entries, /api/outputs, /api/movements

app.use(notFound);
app.use(errorHandler);

export default app;
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
    origin: env.clientUrls,
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/health', healthRoutes);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', movementRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
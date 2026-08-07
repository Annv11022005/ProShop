import 'dotenv/config';
import path from 'path';
import express from 'express';

import applySecurityMiddleware from './config/security.js';
import mountRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Bảo mật
applySecurityMiddleware(app);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');

// Routes
mountRoutes(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

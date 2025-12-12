// src/server.js
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';
import { errors } from 'celebrate';
import { notFoundHandler } from '../src/middleware/notFoundHandler.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import categoriesRoutes from './routes/categoriesRoutes.js';

import { logger } from './middleware/logger.js';

import userRoutes from './routes/userRoutes.js';
import feedbacksRoutes from './routes/feedbacksRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);

app.use(helmet());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3005'] }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use(userRoutes);
app.use(feedbacksRoutes);
app.use(categoriesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

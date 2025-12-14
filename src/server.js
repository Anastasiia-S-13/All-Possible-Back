import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino-http';
import 'dotenv/config';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import userRoutes from './routes/userRoutes.js';
import feedbacksRoutes from './routes/feedbacksRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import toolsRoutes from './routes/toolsRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(pino());
app.use(logger);

app.use('/api/users', userRoutes);
app.use('/api/feedbacks', feedbacksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tools', toolsRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

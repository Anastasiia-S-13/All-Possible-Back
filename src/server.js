import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino-http';
import 'dotenv/config';
import { errors } from 'celebrate';

// DB
import { connectMongoDB } from './db/connectMongoDB.js';

// Middleware
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import publicUserRoutes from './routes/publicUserRoutes.js';
import feedbacksRoutes from './routes/feedbacksRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import toolsRoutes from './routes/toolsRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Global middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:3005',
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.use(cookieParser());
app.use(pino());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use(userRoutes);
app.use(publicUserRoutes);
app.use(feedbacksRoutes);
app.use(categoriesRoutes);
app.use('/api/tools', toolsRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// Connect DB
await connectMongoDB();

// Run server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

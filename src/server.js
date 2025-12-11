import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import 'dotenv/config';

import { logger } from './middleware/logger.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3005']
}));
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRoutes);

// Celebrate validation errors
app.use(errors());

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();

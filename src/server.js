import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import feedbacksRoutes from './routes/feedbacksRoutes.js';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errors } from 'celebrate';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(feedbacksRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
// import cors from 'cors';
// import pino from 'pino-http';
import 'dotenv/config';
import { errors } from 'celebrate';
import { notFoundHandler } from '../src/middleware/notFoundHandler.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import categoriesRoutes from './routes/categoriesRoutes.js';

const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(categoriesRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

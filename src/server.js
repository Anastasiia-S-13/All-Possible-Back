// src/server.js
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);


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

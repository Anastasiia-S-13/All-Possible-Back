// src/server.js
import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import pino from "pino-http";
import toolRoutes from "./routes/toolRoutes.js";


// --- DB ---
import { connectMongoDB } from "./db/connectMongoDB.js";

// --- Middleware ---
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { errors } from "celebrate";

// --- Routes ---
import userRoutes from "./routes/userRoutes.js";
import feedbacksRoutes from "./routes/feedbacksRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Global middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(pino());
app.use(logger);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/feedbacks", feedbacksRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/tools", toolRoutes);

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



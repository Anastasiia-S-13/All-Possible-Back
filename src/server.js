import express from 'express';
import 'dotenv/config';

// ROUTES
import toolRoutes from "./routes/toolRoutes.js";

// DB
import { connectMongoDB } from "./db/connectMongoDB.js";

// MIDDLEWARE
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { errors } from "celebrate";


const app = express();

const PORT = process.env.PORT ?? 3000;


// --- PUBLIC ROUTES ---
app.use("/tools", toolRoutes);


app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

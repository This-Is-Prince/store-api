import 'express-async-errors'
import express from "express";
import dotenv from "dotenv";
import errorHandlerMiddleware from "./middleware/error-handler";
import notFoundMiddleware from "./middleware/not-found";
import connectDB from "./db";
import productRouter from "./routes/product";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send(`<h1>Store Api</h1><a href="/api/v1/products">Products</a>`);
});

app.use("/api/v1/products", productRouter);

// Products route

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI || "");
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();

import { config } from "dotenv";
config();

import jsonProducts from "./assets/products.json";
import connectDB from "./db";
import Product from "./models/product";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || "");
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

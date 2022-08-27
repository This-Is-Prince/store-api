import { Router } from "express";
import { getAllProducts, getAlProductsStatic } from "../controllers/products";

const productRouter = Router();
productRouter.get("/", getAllProducts);
productRouter.get("/static", getAlProductsStatic);

export default productRouter;

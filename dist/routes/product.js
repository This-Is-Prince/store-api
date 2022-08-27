"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const productRouter = (0, express_1.Router)();
productRouter.get("/", products_1.getAllProducts);
productRouter.get("/static", products_1.getAlProductsStatic);
exports.default = productRouter;

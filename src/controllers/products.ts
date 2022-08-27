import { RequestHandler } from "express";
import Product from "../models/product";

const getAlProductsStatic: RequestHandler = async (req, res) => {
  const search = "ab";
  const products = await Product.find({
    name: { $regex: search, $options: "i" },
  });
  res.status(200).json({ products });
};

interface QueryObject {
  featured?: boolean;
  company?: string;
  name?: any;
}

const getAllProducts: RequestHandler = async (req, res) => {
  const { featured, company, name } = req.query;
  const queryObject: QueryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company as string;
  }
  if (name) {
    queryObject.name = { $regex: name as string, $options: "i" };
  }
  console.log(queryObject);

  const products = await Product.find(queryObject);
  res.status(200).json({ products });
};

export { getAlProductsStatic, getAllProducts };

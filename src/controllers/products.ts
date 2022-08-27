import { RequestHandler } from "express";
import Product from "../models/product";

const getAlProductsStatic: RequestHandler = async (req, res) => {
  // const search = "ab";
  // const products = await Product.find({
  //   name: { $regex: search, $options: "i" },
  // });

  // const products = await Product.find({}).sort("-name -price");
  const products = await Product.find({}).select("name price");
  res.status(200).json({ products });
};

interface QueryObject {
  featured?: boolean;
  company?: string;
  name?: any;
}

const getAllProducts: RequestHandler = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
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

  // console.log(queryObject);

  let result = Product.find(queryObject);
  if (sort) {
    const sortList = (sort as string).split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  if (fields) {
    const fieldsList = (fields as string).split(",").join(" ");
    result = result.select(fieldsList);
  }
  const products = await result;
  res.status(200).json({ products });
};

export { getAlProductsStatic, getAllProducts };

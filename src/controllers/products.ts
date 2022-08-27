import { RequestHandler } from "express";
import Product from "../models/product";

const getAlProductsStatic: RequestHandler = async (req, res) => {
  // const search = "ab";
  // const products = await Product.find({
  //   name: { $regex: search, $options: "i" },
  // });

  // const products = await Product.find({}).sort("-name -price");
  // const products = await Product.find({}).select("name price");
  // const products = await Product.find({})
  //   .sort("name")
  //   .select("name price")
  //   .limit(10)
  //   .skip(1);
  const products = await Product.find({
    price: {
      $gt: 30,
    },
  })
    .sort("name")
    .select("name price");
  res.status(200).json({ products });
};

interface QueryObject {
  [key: string]: any;
}

const getAllProducts: RequestHandler = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
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
  if (numericFilters) {
    const operatorMap: {
      [key: string]: string;
    } = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(>|>=|=|<=|<)\b/g;

    (numericFilters as string)
      .replace(regEx, (match) => `-${operatorMap[match]}-`)
      .split(",")
      .forEach((filter) => {
        const [field, operator, value] = filter.split("-");
        queryObject[field] = {};
        queryObject[field][operator] = value;
      });
  }

  console.log(queryObject);

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products });
};

export { getAlProductsStatic, getAllProducts };

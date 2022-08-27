import { RequestHandler } from "express";

const getAlProductsStatic: RequestHandler = async (req, res) => {
  res.status(200).json({ msg: "products testing route" });
};

const getAllProducts: RequestHandler = async (req, res) => {
  res.status(200).json({ msg: "products route" });
};

export { getAlProductsStatic, getAllProducts };

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.getAlProductsStatic = void 0;
const product_1 = __importDefault(require("../models/product"));
const getAlProductsStatic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const products = yield product_1.default.find({
        price: {
            $gt: 30,
        },
    })
        .sort("name")
        .select("name price");
    res.status(200).json({ products });
});
exports.getAlProductsStatic = getAlProductsStatic;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};
    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }
    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        };
        const regEx = /\b(>|>=|=|<=|<)\b/g;
        numericFilters
            .replace(regEx, (match) => `-${operatorMap[match]}-`)
            .split(",")
            .forEach((filter) => {
            const [field, operator, value] = filter.split("-");
            queryObject[field] = {};
            queryObject[field][operator] = value;
        });
    }
    console.log(queryObject);
    let result = product_1.default.find(queryObject);
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList);
    }
    else {
        result = result.sort("createdAt");
    }
    if (fields) {
        const fieldsList = fields.split(",").join(" ");
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const products = yield result;
    res.status(200).json({ products });
});
exports.getAllProducts = getAllProducts;

import express from "express";
import { checkSchema } from "express-validator";
import {
  addProductController,
  getProductListController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";
import authenticateService from "../services/auth/authenticate.service";
import productValidation from "../validations/product/product.validation";
import validation from "../validations/validation";
import deleteProductValidation from "../validations/product/delete-product.validation";

const productRouter = express.Router();

productRouter.get("/", authenticateService, getProductListController);

productRouter.post(
  "/",
  authenticateService,
  checkSchema(productValidation),
  validation,
  addProductController
);

productRouter.delete(
  "/",
  authenticateService,
  checkSchema(deleteProductValidation),
  validation,
  deleteProductController
);

productRouter.put(
  "/:id",
  authenticateService,
  checkSchema(productValidation),
  validation,
  updateProductController
);

export default productRouter;

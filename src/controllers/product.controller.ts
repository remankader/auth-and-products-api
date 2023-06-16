import { Request, Response } from "express";
import { In } from "typeorm";
import { Product } from "../entities/product.entity";
import ormconfig from "../ormconfig";
import responseMessage from "../services/response-message.service";
import { GENERIC_ERROR_MESSAGE } from "../shared/constants/message";
import { PRODUCT_LIST_DEFAULT_TAKE_PER_PAGE } from "../shared/constants/product";

// GET PRODUCT LIST
export async function getProductListController(req: Request, res: Response) {
  const userId: number = Number(req.user.userId);

  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const take = req.query.take
    ? Number(req.query.take)
    : PRODUCT_LIST_DEFAULT_TAKE_PER_PAGE;

  const findProductListData: any = {
    where: { userId },
    skip,
    take,
    order: {
      id: "DESC",
    },
  };

  const foundProductListData = await ormconfig
    .getRepository(Product)
    .find(findProductListData);

  if (!foundProductListData) {
    return res.status(400).json({
      success: false,
      messages: await responseMessage("Product list not found"),
    });
  }

  const total = await ormconfig
    .getRepository(Product)
    .count({ where: { userId } });

  // return used fetch parameters in with response
  const fetchParams = {
    skip,
    take,
  };

  return res.json({
    success: true,
    messages: await responseMessage("Product list found successfully"),
    data: { list: foundProductListData, total, fetchParams },
  });
}

// ADD PRODUCT
export async function addProductController(req: Request, res: Response) {
  const userId: number = Number(req.user.userId);

  const saveProductData = {
    name: String(req.body.productName),
    categoryId: Number(req.body.categoryId),
    price: Number(req.body.price),
    statusId: Number(req.body.statusId),
    userId,
  };

  const savedProductData = await ormconfig
    .getRepository(Product)
    .save(saveProductData);

  if (!savedProductData) {
    return res.status(500).json({
      success: false,
      messages: await responseMessage(GENERIC_ERROR_MESSAGE),
    });
  }

  return res.json({
    success: true,
    messages: await responseMessage("Product added successfully"),
    data: { product: savedProductData },
  });
}

// UPDATE PRODUCT
export async function updateProductController(req: Request, res: Response) {
  const userId: number = Number(req.user.userId);
  const productId = Number(req.params.id);

  // check if product exists
  const foundProductListData = await ormconfig
    .getRepository(Product)
    .findOne({ where: { userId, id: productId } });

  if (!foundProductListData) {
    return res.status(400).json({
      success: false,
      messages: await responseMessage("Product not found"),
    });
  }

  // update product
  const updateProductData = {
    name: String(req.body.productName),
    categoryId: Number(req.body.categoryId),
    price: Number(req.body.price),
    statusId: Number(req.body.statusId),
    userId: Number(userId),
  };

  const updatedProductData = await ormconfig
    .getRepository(Product)
    .update({ userId, id: productId }, updateProductData);

  if (!updatedProductData) {
    return res.status(500).json({
      success: false,
      messages: await responseMessage(GENERIC_ERROR_MESSAGE),
    });
  }

  return res.json({
    success: true,
    messages: await responseMessage("Product updated successfully"),
  });
}

export async function deleteProductController(req: Request, res: Response) {
  const userId: number = Number(req.user.userId);
  const productIds: number[] = req.body.productIds;

  const deletedProductsData = await ormconfig
    .getRepository(Product)
    .delete({ userId, id: In(productIds) });

  if (!deletedProductsData) {
    return res.status(500).json({
      success: false,
      messages: await responseMessage(GENERIC_ERROR_MESSAGE),
    });
  }

  return res.json({
    success: true,
    messages: await responseMessage("Product(s) deleted successfully"),
  });
}

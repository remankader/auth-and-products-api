import { PRODUCT_STATUS } from "../../shared/constants/product";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_NAME_MAX_LENGTH,
} from "../../shared/constants/product";

const productValidation = {
  productName: {
    exists: {
      errorMessage: "Product name is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Product name should be string" },
    isLength: {
      options: { max: PRODUCT_NAME_MAX_LENGTH },
      errorMessage: `Product name can be maximum ${PRODUCT_NAME_MAX_LENGTH} characters`,
    },
  },
  categoryId: {
    exists: {
      errorMessage: "Category id is required",
      options: { checkFalsy: true },
    },
    isInt: { errorMessage: "Category id should be an integer" },
    isIn: {
      options: [PRODUCT_CATEGORIES.map((category) => category.id)],
      errorMessage: "Invalid category",
    },
  },
  price: {
    exists: {
      errorMessage: "Price is required",
    },
    isFloat: { options: { min: 0 }, errorMessage: "Invalid price" },
  },
  statusId: {
    exists: {
      errorMessage: "Status id is required",
      options: { checkFalsy: true },
    },
    isInt: { errorMessage: "Status id should be an integer" },
    isIn: {
      options: [PRODUCT_STATUS.map((status) => status.id)],
      errorMessage: "Invalid status",
    },
  },
};

export default productValidation;

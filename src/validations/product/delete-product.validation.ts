const deleteProductValidation = {
  productIds: {
    exists: {
      errorMessage: "ProductIds required",
      options: { checkFalsy: true },
    },
    isArray: {
      options: { min: 1 },
      errorMessage: "ProductIds must be an array",
    },
  },
};

export default deleteProductValidation;

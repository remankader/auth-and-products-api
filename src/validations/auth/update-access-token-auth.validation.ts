const updateAccessTokenAuthValidation = {
  refreshToken: {
    exists: {
      errorMessage: "Refresh token is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Refresh token should be string" },
  },
};

export default updateAccessTokenAuthValidation;

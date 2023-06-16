const loginAuthValidation = {
  username: {
    exists: {
      errorMessage: "Username is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Username should be string" },
  },
  password: {
    exists: {
      errorMessage: "Password is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Password should be string" },
  },
};

export default loginAuthValidation;

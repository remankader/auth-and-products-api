import {
  PW_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../shared/constants/register-auth";

const registerAuthValidation = {
  username: {
    exists: {
      errorMessage: "Username is required",
      options: { checkFalsy: true },
    },
    isString: { errorMessage: "Username should be string" },
    matches: {
      options: /^[a-z0-9-]+$/,
      errorMessage: "Lowercase letters, numbers and hyphens only",
    },
    isLength: {
      options: { min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH },
      errorMessage: `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`,
    },
  },
  password: {
    exists: { errorMessage: "Password is required" },
    isString: { errorMessage: "password should be string" },
    isLength: {
      options: { min: PW_MIN_LENGTH },
      errorMessage: `Password must be at least ${PW_MIN_LENGTH} characters`,
    },
    matches: {
      options: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
      errorMessage: "Must contain at least one letter, number, and symbol",
    },
  },
  passwordConfirmation: {
    custom: {
      options: (value: string, { req }: any) => {
        if (value !== req.body?.password) {
          throw new Error("Confirmation password does not match password");
        }
        return req;
      },
    },
  },
};

export default registerAuthValidation;

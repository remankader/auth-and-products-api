import express from "express";
import { checkSchema } from "express-validator";
import registerAuthValidation from "../validations/auth/register-auth.validation";
import validation from "../validations/validation";
import {
  loginAuthController,
  logoutAuthController,
  registerAuthController,
  updateAccessTokenAuthController,
} from "../controllers/auth.controller";
import loginAuthValidation from "../validations/auth/login-auth.validation";
import logoutAuthValidation from "../validations/auth/logout-auth.validation";
import authenticateService from "../services/auth/authenticate.service";
import updateAccessTokenAuthValidation from "../validations/auth/update-access-token-auth.validation";

const authRouter = express.Router();

authRouter.post(
  "/register",
  checkSchema(registerAuthValidation),
  validation,
  registerAuthController
);

authRouter.post(
  "/login",
  checkSchema(loginAuthValidation),
  validation,
  loginAuthController
);

authRouter.put(
  "/access-token",
  checkSchema(updateAccessTokenAuthValidation),
  validation,
  updateAccessTokenAuthController
);

authRouter.delete(
  "/logout",
  authenticateService,
  checkSchema(logoutAuthValidation),
  validation,
  logoutAuthController
);

export default authRouter;

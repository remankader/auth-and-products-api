import { Express } from "express";
import { pageNotFoundErrorController } from "../controllers/error.controller";
import authRouter from "./auth.router";
import productRouter from "./product.router";
import { getHomeController } from "../controllers/home.controller";

function routes(app: Express) {
  app.get("/", getHomeController);
  app.use("/auth", authRouter);
  app.use("/product", productRouter);

  app.use(pageNotFoundErrorController);
}

export default routes;

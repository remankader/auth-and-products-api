import { Request, Response } from "express";
import responseMessage from "../services/response-message.service";

export async function pageNotFoundErrorController(req: Request, res: Response) {
  return res
    .status(404)
    .json({
      success: false,
      messages: await responseMessage("Page not found"),
    });
}

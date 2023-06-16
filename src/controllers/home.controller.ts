import { Request, Response } from "express";
import responseMessage from "../services/response-message.service";

export async function getHomeController(req: Request, res: Response) {
  return res.json({
    success: true,
    messages: await responseMessage("api root"),
  });
}

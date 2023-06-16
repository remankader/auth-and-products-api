import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

function validation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      messages: errors.array(),
    });
  }

  next();
}

export default validation;

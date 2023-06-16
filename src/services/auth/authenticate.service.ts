import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../entities/user.entity";
import ormconfig from "../../ormconfig";
import { GENERIC_ERROR_MESSAGE } from "../../shared/constants/message";
import {
  USER_STATUS_ACTIVE,
  USER_STATUS_INACTIVE,
  USER_STATUS_SUSPENDED,
} from "../../shared/constants/user-status";
import responseMessage from "../response-message.service";

export default async function authenticateService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.query.at
    ? req.query.at
    : req.headers["authorization"]?.split(" ")[1];

  if (token === null) {
    return res.status(401).json({
      success: false,
      messages: await responseMessage("Unauthorized"),
    });
  }

  jwt.verify(
    token as string,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (err, user: any) => {
      if (err) {
        return res.status(403).json({
          success: false,
          messages: await responseMessage({
            msg: "Authentication failed",
            param: "logout",
          }),
        });
      }

      // check if user status is active
      if (!user?.userId) {
        return res.status(500).json({
          success: false,
          messages: await responseMessage(GENERIC_ERROR_MESSAGE),
        });
      }

      const foundUserData = await ormconfig.getRepository(User).findOne({
        where: { id: user.userId },
      });

      req.query.userId = user.userId;

      if (!foundUserData?.statusId) {
        return res.status(500).json({
          success: false,
          messages: await responseMessage(GENERIC_ERROR_MESSAGE),
        });
      }

      const statusId = foundUserData.statusId;

      if (statusId === USER_STATUS_SUSPENDED) {
        return res.status(401).json({
          success: false,
          messages: await responseMessage("Account suspended"),
        });
      } else if (statusId === USER_STATUS_INACTIVE) {
        return res.status(401).json({
          success: false,
          messages: await responseMessage("Account Inactive / Not verified"),
        });
      } else if (statusId !== USER_STATUS_ACTIVE) {
        return res
          .status(500)
          .json({ success: false, message: GENERIC_ERROR_MESSAGE });
      }

      req.user = user;
      next();
    }
  );
}

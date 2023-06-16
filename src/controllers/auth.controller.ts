import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {
  USER_STATUS_INACTIVE,
  USER_STATUS_SUSPENDED,
} from "../shared/constants/user-status";
import ormconfig from "../ormconfig";
import responseMessage from "../services/response-message.service";
import { User } from "../entities/user.entity";
import { GENERIC_ERROR_MESSAGE } from "../shared/constants/message";
import generateAccessToken from "../services/auth/generate-access-token.service";
import generateRefreshToken from "../services/auth/generate-refresh-token.service";
import { RefreshToken } from "../entities/refresh-token.entity";
import jwt from "jsonwebtoken";

dotenv.config();

// REGISTER
export async function registerAuthController(req: Request, res: Response) {
  // check if username already exists
  const foundUserDataByUsername = await ormconfig.getRepository(User).findOne({
    where: { username: req.body.username },
  });

  if (foundUserDataByUsername) {
    return res.status(409).json({
      success: false,
      messages: await responseMessage({
        msg: "Username already exists",
        param: "username",
      }),
    });
  }

  // encrypt password
  const salt = await bcrypt.genSalt(
    Number(process.env.PASSWORD_SALT_ROUNDS) || 10
  );

  // save user
  const saveUserData = {
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, salt),
  };

  const savedUserData = await ormconfig.getRepository(User).save(saveUserData);

  if (!savedUserData) {
    return res.status(500).json({
      success: false,
      messages: await responseMessage(GENERIC_ERROR_MESSAGE),
    });
  }

  // generate access token
  const accessToken = await generateAccessToken(savedUserData.id);

  // generate refresh token
  const refreshToken = await generateRefreshToken(
    savedUserData.username,
    savedUserData.id
  );

  return res.json({
    success: true,
    messages: await responseMessage("Registered successfully"),
    data: { accessToken, refreshToken },
  });
}

// LOGIN
export async function loginAuthController(req: Request, res: Response) {
  const username = req.body.username;

  // find user
  const foundUserData = await ormconfig
    .getRepository(User)
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where(`user.username = :username`, { username })
    .getOne();

  if (!foundUserData) {
    return res.status(401).json({
      success: false,
      messages: await responseMessage({
        msg: `Username doesn't exist`,
        param: "username",
      }),
    });
  }

  // check password
  const passwordMatched = await bcrypt.compare(
    req.body.password,
    foundUserData.password
  );

  if (!passwordMatched) {
    return res.status(401).json({
      success: false,
      messages: await responseMessage("Invalid username or password"),
    });
  }

  // check if user is active
  let userStatusMsg = "";
  switch (foundUserData.statusId) {
    case USER_STATUS_INACTIVE:
      userStatusMsg = "Account inactive";
      break;
    case USER_STATUS_SUSPENDED:
      userStatusMsg = "Account suspended";
      break;
  }

  if (userStatusMsg) {
    return res
      .status(401)
      .json({ success: false, messages: await responseMessage(userStatusMsg) });
  }

  // generate access token
  const accessToken = await generateAccessToken(foundUserData.id);

  // generate refresh token
  const refreshToken = await generateRefreshToken(
    foundUserData.username,
    foundUserData.id
  );

  res.json({
    success: true,
    messages: await responseMessage("Logged in successfully"),
    data: { accessToken, refreshToken },
  });
}

// UPDATE ACCESS TOKEN
export async function updateAccessTokenAuthController(
  req: Request,
  res: Response
) {
  const refreshToken = req.body.refreshToken;

  // check if refresh token exists in db
  const foundRefreshTokenData = await ormconfig
    .getRepository(RefreshToken)
    .findOneBy({ refreshToken });

  if (!foundRefreshTokenData) {
    return res.status(401).json({
      success: false,
      messages: await responseMessage({
        msg: "Token invalid / expired",
        param: "logout",
      }),
    });
  }

  // verify refresh token
  jwt.verify(
    refreshToken,
    String(process.env.REFRESH_TOKEN_SECRET),
    async (err: any, user: any) => {
      if (err)
        return res.status(401).json({
          success: false,
          messages: await responseMessage({
            msg: "Invalid / expired access token",
            param: "logout",
          }),
        });

      const accessToken = await generateAccessToken(user.userId);

      res.json({
        success: true,
        messages: await responseMessage("Access token updated successfully"),
        data: { accessToken, refreshToken },
      });
    }
  );
}

// LOGOUT
export async function logoutAuthController(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  const deletedRefreshTokenData = await ormconfig
    .getRepository(RefreshToken)
    .delete({ refreshToken });

  if (!deletedRefreshTokenData.affected) {
    return res.status(500).json({
      success: false,
      messages: await responseMessage("Invalid / expired refresh token"),
    });
  }

  res.json({
    success: true,
    messages: await responseMessage("logged out successfully"),
  });
}

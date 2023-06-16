import jwt from "jsonwebtoken";
import { RefreshToken } from "../../entities/refresh-token.entity";
import ormconfig from "../../ormconfig";

export default async function generateRefreshToken(
  username: string,
  userId: number
): Promise<string> {
  const user: { username: string; userId: number } = { username, userId };

  const refreshToken = jwt.sign(user, String(process.env.REFRESH_TOKEN_SECRET));

  const savedRefreshTokenData = await ormconfig
    .getRepository(RefreshToken)
    .save({ userId, refreshToken: refreshToken });

  return refreshToken;
}

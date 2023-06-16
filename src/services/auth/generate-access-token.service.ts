import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function generateAccessToken(
  userId: number
): Promise<string> {
  const user: { userId: number } = { userId };

  const accessToken = jwt.sign(user, String(process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  return accessToken;
}

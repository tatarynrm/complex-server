import jwt from 'jsonwebtoken';

const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, accessSecret);

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, refreshSecret);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret);

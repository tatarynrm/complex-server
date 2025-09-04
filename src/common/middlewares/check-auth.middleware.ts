import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { access_token,refresh_token } = req.cookies;
    if (!access_token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const payload = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as {
      id: number;
      email: string;
      iat?: number;
      exp?: number;
    };

    req.user = payload; // Тепер TS не скаржитиметься
    req.currentRefreshToken = refresh_token; // додаємо поле для подальшого використання
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

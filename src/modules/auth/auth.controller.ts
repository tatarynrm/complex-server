import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from '../../common/utils/jwt';
import { db } from '../../config/db';
import { authService } from './auth.service';
import { HttpException } from '../../common/utils/errors';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }

      res.status(500).json({ message: 'Server error' });
    }
  }

  async login(req: Request, res: Response) {
    // User-Agent
    const userAgent = req.headers['user-agent'];

    // IP-адреса
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] || // якщо за проксі
      req.socket.remoteAddress; // прямий конект
    try {
      const result = await authService.login(req.body, userAgent, ip);

      if (result.message === 'Невірний пароль') {
        return res.json(result);
      }
      if (result.message === 'Користувача з такими даними не знайдено') {
        return res.json(result);
      }

      res.cookie('access_token', result.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production', // https only
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 хв
      });
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production', // https only
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
      });
      res.json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }

      res.status(500).json({ message: 'Server error' });
    }
  }
  async refreshToken(req: Request, res: Response) {
    const token = req.cookies.refresh_token;

    if (!token) return res.sendStatus(401);

    try {
      const newAccessToken = await authService.refreshToken(token);

      if (newAccessToken.accessToken) {
        res.cookie('access_token', newAccessToken.accessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production', // https only
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 хв
        });

        return res.status(200).json({ message: 'OK' }); // <--- ТАК ПРАВИЛЬНО
      } else {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.status(401).json({ message: 'You dont have permission' });
      }
    } catch (err) {
      console.error('Refresh token error:', err);
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      return res.sendStatus(403);
    }
  }

  async getMe(req: Request, res: Response) {
    const access_token = req.cookies.access_token;
    if (!access_token) return res.sendStatus(401);
    try {
      const result = await authService.getMe(access_token);

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.status(200).json({ message: 'Logout success', status: 200 });
    } catch (error) {
      console.log(error);
    }
  }

  async getUserSessions(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const currentRefreshToken = req.currentRefreshToken;

    try {
      const result = await db.query(
        'SELECT refresh_token, expires_at, created_at, user_agent, ip_address, last_activity FROM parking_users_sessions WHERE user_id = $1 ORDER BY created_at DESC',
        [userId],
      );

      const sessions = result.rows.map((session) => ({
        ...session,
        isCurrent: session.refresh_token === currentRefreshToken,
      }));

      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // DELETE /api/user/sessions
  async deleteOtherSessions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const currentRefreshToken = req.cookies.refresh_token;

      if (!currentRefreshToken) {
        return res
          .status(400)
          .json({ message: 'Refresh token не знайдено у куках' });
      }

      // Видалити всі сесії, окрім поточної
      await db.query(
        `DELETE FROM parking_users_sessions 
       WHERE user_id = $1 AND refresh_token != $2`,
        [userId, currentRefreshToken],
      );

      res.json({ message: 'Інші сесії видалені' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка сервера' });
    }
  }
}

export const authController = new AuthController();

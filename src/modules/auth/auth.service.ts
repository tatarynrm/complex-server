import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import dotenv from 'dotenv';

import { IUser, LoginDto, RegisterDto } from './dto/auth.dto';
import { HttpException } from '../../common/utils/errors';
import { db } from '../../config/db';
import { getBrowserName } from './utils/request.util';

dotenv.config();

class AuthService {
  private accessSecret = process.env.ACCESS_TOKEN_SECRET!;
  private refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
  private accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
  private refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

  async register(registerData: RegisterDto) {
    const { email, password, name, surname, last_name } = registerData;

    const userExists = await db.query(
      'SELECT id FROM parking_users WHERE email = $1',
      [email],
    );
    if (userExists.rowCount) {
      throw new HttpException(409, 'Користувач вже існує');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO parking_users (email, password_hash,name,surname,last_name) VALUES ($1, $2,$3,$4,$5) RETURNING id, email',
      [email, hashedPassword, name, surname, last_name],
    );

    return result.rows[0];
  }
  async login(loginData: LoginDto, userAgent?: string, ipAddress?: string) {
    const { email, password } = loginData;

    const existUser = await db.query(
      `select * from parking_users where email = $1`,
      [email],
    );
    const user = existUser.rows[0];

    if (!user) {
      return {
        success: false,
        message: 'Користувача з такими даними не знайдено',
      };
    }

    const equalPasswords = await bcrypt.compare(password, user?.password_hash);
    if (!equalPasswords) {
      return {
        success: false,
        message: 'Невірний пароль',
      };
    }
    const jwtPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
      jwtPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: '7d',
      },
    );

    // Розрахунок дати закінчення refresh токена
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 днів
    await db.query(
      `INSERT INTO parking_users_sessions (user_id, refresh_token, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        refreshToken,
        expiresAt,
        getBrowserName(userAgent || '') || null,
        ipAddress || null,
      ],
    );
    const { password_hash, ...safeUser } = user;
    return { success: true, user: safeUser, accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string) {
    let payload: JwtPayload & { id: number; email: string };

    try {
      payload = this.verifyRefreshToken(oldRefreshToken) as JwtPayload & {
        id: number;
        email: string;
      };
    } catch {
      throw new HttpException(401, 'Невалідний refresh token');
    }

    // Перевірка наявності сесії
    const session = await db.query(
      `SELECT * FROM parking_users_sessions WHERE user_id = $1 AND refresh_token = $2`,
      [payload.id, oldRefreshToken],
    );

    if (session.rowCount === 0) {
      throw new HttpException(401, 'Сесія не знайдена або відкликана');
    }

    const sessionData = session.rows[0];
    if (new Date(sessionData.expires_at) < new Date()) {
      // Якщо токен протермінований — видаляємо сесію
      await db.query(`DELETE FROM parking_users_sessions WHERE id = $1`, [
        sessionData.id,
      ]);
      throw new HttpException(401, 'Сесія протермінована');
    }
    // 🔹 Оновлюємо last_activity
    await db.query(
      `UPDATE parking_users_sessions 
     SET last_activity = NOW() 
     WHERE id = $1`,
      [sessionData.id],
    );
    // Генеруємо новий access токен
    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      this.accessSecret,
      { expiresIn: '15m' },
    );

    return {
      success: true,
      accessToken: newAccessToken,
    };
  }

  async getMe(token: string) {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as JwtPayload & {
      email: string;
      id: number;
    };
    const { rows } = await db.query(
      `select * from parking_users where id = $1`,
      [decoded.id],
    );

    const result = rows[0];
    const { password_hash, ...safeUser } = result;
    return {
      ...safeUser,
    };
  }
  generateAccessToken(userId: number) {
    return jwt.sign({ userId }, this.accessSecret, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(userId: number) {
    return jwt.sign({ userId }, this.refreshSecret, {
      expiresIn: '10d',
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessSecret);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret);
  }
}

export const authService = new AuthService();

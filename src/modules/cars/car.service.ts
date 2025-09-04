import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { db } from '../../config/db';

import { HttpException } from '../../common/utils/errors';

dotenv.config();

class CarService {
  private accessSecret = process.env.ACCESS_TOKEN_SECRET!;
  private refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
  private accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
  private refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

  async register(data:any) {
    const { email, password, name, surname, last_name } = data;
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [
      email,
    ]);
    if (userExists.rowCount) {
      throw new HttpException(409, 'Користувач вже існує');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (email, password_hash,name,surname,last_name) VALUES ($1, $2,$3,$4,$5) RETURNING id, email',
      [email, hashedPassword, name, surname, last_name],
    );

    return result.rows[0];
  }


}

export const carService = new CarService();

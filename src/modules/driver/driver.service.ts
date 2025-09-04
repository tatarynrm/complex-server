import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { db } from '../../config/db';

import { HttpException } from '../../common/utils/errors';
import { IDriver } from './dto/driver.dto';

dotenv.config();

class DriverSerivce {
  async createNewDriver(data: IDriver) {
    const { name, surname, last_name, phone_number, comment } = data;
    const result = await db.query(
      `insert into drivers(name,surname,last_name,phone_number,comment) values($1,$2,$3,$4,$5) returning *`,
      [name, surname, last_name, phone_number, comment],
    );
    return result.rows[0];
  }
  async updateDriver(data: IDriver) {
    const { name, surname, last_name, phone_number, comment, id } = data;
    const result = await db.query(
      `
      UPDATE drivers
      SET name = $1,
          surname = $2,
          last_name = $3,
          phone_number = $4,
          comment = $5
      WHERE id = $6
      RETURNING *;
      `,
      [name, surname, last_name, phone_number, comment, id],
    );
    console.log('Оновлено водія:', result.rows[0]);
    return result.rows[0];
  }
  async getAllDrivers() {
    const result = await db.query(
      `select * from drivers order by updated_at desc`,
    );

    return result.rows;
  }
}

export const driverService = new DriverSerivce();

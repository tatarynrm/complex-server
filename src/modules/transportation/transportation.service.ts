import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { db } from '../../config/db';

import { HttpException } from '../../common/utils/errors';
import { ICreateTransportation } from './dto/transportation.dto';

dotenv.config();
interface FilterParams {
  driver_id?: number;
  truck_id?: number;
  date_begin?: string; // yyyy-mm-dd
  date_end?: string;
  page: number;
  limit: number;
}
class TransportationSerivce {
  private accessSecret = process.env.ACCESS_TOKEN_SECRET!;
  private refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
  private accessExpiresIn = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
  private refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

  async createNewTransportation(data: ICreateTransportation) {
    const { driver, truck, comment, date_begin, date_end, status } = data;

    const result = await db.query(
      `insert into transportations (driver,truck,comment,date_begin,status) values($1,$2,$3,$4,$5) returning * `,
      [driver, truck, comment, date_begin, status],
    );
    console.log(result.rows[0]);
    return result.rows[0];
  }
  // Список активних водіїв
  async getActiveDriversList() {
    const result = await db.query(`select * from drivers`);
    return result.rows;
  }
  // Список активних траків
  async getActiveTrucksList() {
    const result = await db.query(`select * from trucks`);
    return result.rows;
  }
  async getActiveStatusList() {
    const result = await db.query(`select * from transportation_status`);
    return result.rows;
  }

  async getTransportationFormData() {
    const drivers = await this.getActiveDriversList();
    const trucks = await this.getActiveTrucksList();
    const status = await this.getActiveStatusList();
    return {
      drivers,
      trucks,
      status,
    };
  }
  async getTransportations(filters: FilterParams) {
    const { driver_id, truck_id, date_begin, date_end, page, limit } = filters;

    const offset = (page - 1) * limit;

    // Побудуємо SQL динамічно з фільтрами
    let conditions = [];
    let values: (string | number)[] = [];
    let idx = 1;

    if (driver_id) {
      conditions.push(`driver = $${idx++}`);
      values.push(driver_id);
    }
    if (truck_id) {
      conditions.push(`truck = $${idx++}`);
      values.push(truck_id);
    }
    if (date_begin) {
      conditions.push(`date_begin >= $${idx++}`);
      values.push(date_begin);
    }
    if (date_end) {
      conditions.push(`date_end IS NOT NULL AND date_end <= $${idx++}`);
      values.push(date_end);
    }

    const whereSQL = conditions.length
      ? 'WHERE ' + conditions.join(' AND ')
      : '';

    // Запит на кількість (для пагінації)
    const countQuery = `SELECT COUNT(*) FROM transportations ${whereSQL}`;
    const countResult = await db.query(countQuery, values);
    const total = Number(countResult.rows[0].count);

    // Основний запит з пагінацією
    const dataQuery = `
      SELECT a.*,b.surname as driver_surname,b.last_name as driver_last_name,b.name as driver_name,c.plate_number,d.status_title
      FROM transportations a
      left join drivers b on a.driver = b.id
      left join trucks c on a.truck = c.id
      left join transportation_status d on a.status = d.id
      ${whereSQL}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);
    const dataResult = await db.query(dataQuery, values);

    return {
      total,
      page,
      limit,
      data: dataResult.rows,
    };
  }
}

export const transportationSerivce = new TransportationSerivce();

import dotenv from 'dotenv';
import { IConvoyCreate } from './dto/convoy.dto';
import { db } from '../../config/db';

dotenv.config();

class ConvoyService {
  async saveConvoy(data: IConvoyCreate) {
    const { driver, truck } = data;
    console.log(data, 'DATA');

    const result = await db.query(
      `INSERT INTO convoys (driver_id, truck_id) VALUES ($1, $2) RETURNING *`,
      [driver, truck],
    );

    console.log(result.rows, 'RESULT');

    return result.rows; // Return the result for further use if needed
  }
  async getAllConvoys() {
    const result = await db.query(`
  
  select a.*,b.name,b.surname,b.last_name,b.phone_number,c.plate_number,c.brand,c.model,c.car_capacity
  
  from convoys a
  left join drivers b on a.driver_id = b.id
  left join trucks c on a.truck_id = c.id
  
  
  
  `);

    return result.rows; // Return the result for further use if needed
  }
  async getOneConvoy(id: string) {
    const result = await db.query(
      `
  
  select a.*,b.name,b.surname,b.last_name,b.phone_number,c.plate_number,c.brand,c.model,c.car_capacity
  
  from convoys a
  left join drivers b on a.driver_id = b.id
  left join trucks c on a.truck_id = c.id
  where a.id = $1
  
  
  `,
      [id],
    );
console.log(result,'RESULT CSERRE');

    return result.rows[0]; // Return the result for further use if needed
  }
}

export const convoyService = new ConvoyService();

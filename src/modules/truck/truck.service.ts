import dotenv from 'dotenv';
import { db } from '../../config/db';
import { ITruck } from './dto/truck.dto';


dotenv.config();


class TruckService {
  async createNewTruck(data: ITruck) {
    const {
      vin_code,
      plate_number,
      year,
      brand,
      model,
      load_capacity,
      car_capacity,
      inspection_date,
      mileage,
      status,
    } = data;

    const result = await db.query(
      `insert into trucks ( vin_code,    plate_number,
      year,
      brand,
      model,
      load_capacity,
      car_capacity,
      inspection_date,
      mileage,
      status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *`,
      [
        vin_code,
        plate_number,
        year,
        brand,
        model,
        load_capacity,
        car_capacity,
        inspection_date,
        mileage,
        status,
      ],
    );
    console.log(result.rows[0]);

    return result.rows[0];
  }
  async getAllTrucks() {
    const result = await db.query(`select a.*,b.status_title from trucks a
  left join truck_status b on a.status = b.id
  `);

    return result.rows;
  }
  async getTruckStatus() {
    const result = await db.query(`select * from truck_status`);
    return result.rows;
  }
  async updateTruck(data: ITruck) {
  
    
    const {
      vin_code,
      plate_number,
      year,
      brand,
      model,
      load_capacity,
      car_capacity,
      inspection_date,
      mileage,
      status,
      id,
    } = data;
    const result = await db.query(
      `
      UPDATE trucks
      SET vin_code = $1,
          plate_number = $2,
          year = $3,
          brand = $4,
          model =$5,
          load_capacity = $6,
          car_capacity = $7,
          inspection_date = $8,
          mileage = $9,
          status = $10
      WHERE id = $11
      RETURNING *;
      `,
      [
        vin_code,
        plate_number,
        year,
        brand,
        model,
        load_capacity,
        car_capacity,
        inspection_date,
        mileage,
        status,
        id,
      ],
    );

 
    return result.rows[0];
  }
}

export const truckService = new TruckService();

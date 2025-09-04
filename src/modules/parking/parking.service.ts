import { db } from '../../config/db';

class ParkingSerivce {
  async getAllParkingCars() {
  
    
    
    const result = await db.query(`select * from parking_parked_cars`);
    return result.rows;
  }
}

export const parkingSerivce = new ParkingSerivce();

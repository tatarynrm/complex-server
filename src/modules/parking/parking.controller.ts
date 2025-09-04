import { Request, Response } from 'express';
import { parkingSerivce } from './parking.service';

class ParkingController {
  async getAllParkingCars(req: Request, res: Response) {
   

   
    const result = await parkingSerivce.getAllParkingCars();
 
    
    res.json(result)
  }
}

export const parkingController = new ParkingController();

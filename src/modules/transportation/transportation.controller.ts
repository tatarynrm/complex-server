import { Request, Response } from 'express';

import { HttpException } from '../../common/utils/errors';
import { transportationSerivce } from './transportation.service';

class TransportationrController {
  async createNewTransportation(req: Request, res: Response) {
    const result = await transportationSerivce.createNewTransportation(
      req.body,
    );

    res.json(result)
  }
  async getTransportationFormData(req: Request, res: Response) {
    const data = await transportationSerivce.getTransportationFormData();
    res.json(data);
  }
   async getTransportations(req: Request, res: Response) {
    try {
      const { driver_id, truck_id, date_begin, date_end, page = '1', limit = '10' } = req.query;

      const data = await transportationSerivce.getTransportations({
        driver_id: driver_id ? Number(driver_id) : undefined,
        truck_id: truck_id ? Number(truck_id) : undefined,
        date_begin: typeof date_begin === 'string' ? date_begin : undefined,
        date_end: typeof date_end === 'string' ? date_end : undefined,
        page: Number(page),
        limit: Number(limit),
      });

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export const transportationController = new TransportationrController();

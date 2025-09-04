import { Request, Response } from 'express';




import { HttpException } from '../../common/utils/errors';
import { carService } from './car.service';

class CarController {
  async register(req: Request, res: Response) {
    try {
      const result = await carService.register(req.body);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }

      res.status(500).json({ message: 'Server error' });
    }
  }


}

export const carController = new CarController();

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { truckService } from './truck.service';

class TruckController {
  async createNewTruck(req: Request, res: Response) {
    try {
      const result = await truckService.createNewTruck(req.body);
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
  async updateTruck(req: Request, res: Response) {
    const io = req.app.locals.io;
    try {
      const result = await truckService.updateTruck(req.body);

      io.emit('truck:update-truck', result);
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
  async getAllTrucks(req: Request, res: Response) {
    try {
      const result = await truckService.getAllTrucks();
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }

  async getTruckStatus(req: Request, res: Response) {
    try {
      const result = await truckService.getTruckStatus();
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
}

export const truckController = new TruckController();

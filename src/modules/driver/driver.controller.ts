import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { driverService } from './driver.service';

class DriversController {
  async createNewDriver(req: Request, res: Response) {
    const io = req.app.locals.io;
    try {
      const result = await driverService.createNewDriver(req.body);
      console.log(result,'result driver');
      
      io.emit('drivers:new-driver', result);
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
  async updateDriver(req: Request, res: Response) {
    const result = await driverService.updateDriver(req.body);
    try {
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
  async getAllDrivers(req: Request, res: Response) {
    const result = await driverService.getAllDrivers();
    try {
      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
}

export const driversController = new DriversController();

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { convoyService } from './convoy.service';

class ConvoyController {
  async saveConvoy(req: Request, res: Response) {
    const { driver, truck } = req.body;
    const io = req.app.locals.io;

    try {
      const result = await convoyService.saveConvoy(req.body);
 

      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
  async getAllConvoys(req: Request, res: Response) {
    const io = req.app.locals.io;

    try {
      const result = await convoyService.getAllConvoys();


      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
  async getOneConvoy(req: Request, res: Response) {
    const io = req.app.locals.io;
    const {id} = req.params


    try {
      const result = await convoyService.getOneConvoy(String(id));
      console.log(result, 'result convoy');

      res.json(result);
    } catch (err) {
      console.error('Refresh token error:', err);
      res.sendStatus(403);
    }
  }
}

export const convoyController = new ConvoyController();

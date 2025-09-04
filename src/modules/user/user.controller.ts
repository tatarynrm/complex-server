import { Request, Response } from 'express';
import { userService } from './user.service';
class UserController {
  async getUser(req: Request, res: Response) {
   

   
    const result = await userService.getUser(req.body);
    res.json(result)
  }
}

export const userController = new UserController();

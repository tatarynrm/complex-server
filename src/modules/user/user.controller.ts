import { Request, Response } from 'express';
import { userService } from './user.service';
class UserController {
  async getUsers(req: Request, res: Response) {
    const result = await userService.getUsers();
    res.json(result);
  }
  async updateUser(req: Request, res: Response) {
 
    const result = await userService.updateUser(req.body);
    res.json(result);
  }

}

export const userController = new UserController();

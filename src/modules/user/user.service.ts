import { db } from '../../config/db';

class UserService {

  async getUsers() {
    const result = await db.query(`select * from parking_users`);
    return result.rows;
  }
}

export const userService = new UserService();

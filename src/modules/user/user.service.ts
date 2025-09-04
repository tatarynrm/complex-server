import { db } from '../../config/db';

class UserService {
  async register(data: any) {
  
    
    
    const result = await db.query(`select * from users`);
    return result.rows;
  }
  async login(data: any) {
  
    
    
    const result = await db.query(`select * from users`);
    return result.rows;
  }
  async getUser(data: any) {
  
    
    
    const result = await db.query(`select * from users`);
    return result.rows;
  }
}

export const userService = new UserService();

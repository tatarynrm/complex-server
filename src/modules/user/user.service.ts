import { db } from '../../config/db';
interface UpdateUserDto {
  id:number;
  email: string;
  name: string;
  surname: string;
  last_name: string;
  phone_number: string | null;
  is_admin: boolean | null;
  is_guard: boolean | null;
  is_blocked: boolean | null;
}

class UserService {
  async getUsers() {
    const result = await db.query(`select * from parking_users`);
    return result.rows;
  }

  async updateUser( data: UpdateUserDto) {
    const query = `
    UPDATE parking_users
    SET email = $1,
        name = $2,
        surname = $3,
        last_name = $4,
        phone_number = $5,
        is_admin = $6,
        is_guard = $7,
        is_blocked = $8
    WHERE id = $9
    RETURNING *;
  `;
    const values = [
      data.email,
      data.name,
      data.surname,
      data.last_name,
      data.phone_number,
      data.is_admin,
      data.is_guard,
      data.is_blocked,
      data.id,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }
}

export const userService = new UserService();

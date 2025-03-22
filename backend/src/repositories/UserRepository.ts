import { User, CreateUserDTO } from '../types/User';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
 
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, username, email, password, created_at as "createdAt"
      FROM users
      WHERE email = $1
    `;
   
    const { rows } = await pool.query(query, [email]);
    return rows.length ? rows[0] : null;
  }
 
  async findByUsername(username: string): Promise<User | null> {
    const query = `
      SELECT id, username, email, password, created_at as "createdAt"
      FROM users
      WHERE username = $1
    `;
   
    const { rows } = await pool.query(query, [username]);
    return rows.length ? rows[0] : null;
  }
 
  async create(userData: CreateUserDTO): Promise<User> {
    const id = uuidv4();
    const { username, email, password } = userData;
   
    const query = `
      INSERT INTO users (id, username, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, password, created_at as "createdAt"
    `;
   
    const { rows } = await pool.query(query, [id, username, email, password]);
    return rows[0];
  }
}
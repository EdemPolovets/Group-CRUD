import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { CreateTodoDTO, Todo, UpdateTodoDTO } from "../types/Todo";
 
export class TodoRepository {
    async findAll(userId: string): Promise<Todo[]> {
      const query = `
        SELECT id, title, completed, created_at as "createdAt", user_id as "userId"
        FROM todos
        WHERE user_id = $1
        ORDER BY created_at DESC
      `;
     
      const { rows } = await pool.query(query, [userId]);
      return rows;
    }
 
    async findById(id: string, userId: string): Promise<Todo | null> {
      const query = `
        SELECT id, title, completed, created_at as "createdAt", user_id as "userId"
        FROM todos
        WHERE id = $1 AND user_id = $2
      `;
     
      const { rows } = await pool.query(query, [id, userId]);
      return rows.length ? rows[0] : null;
    }
 
    async create(todoData: CreateTodoDTO): Promise<Todo> {
      const id = uuidv4();
      const { title, userId } = todoData;
     
      const query = `
        INSERT INTO todos (id, title, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, title, completed, created_at as "createdAt", user_id as "userId"
      `;
     
      const { rows } = await pool.query(query, [id, title, userId]);
      return rows[0];
    }
 
    async update(id: string, userId: string, todoData: UpdateTodoDTO): Promise<Todo | null> {
      const updates: string[] = [];
      const values: any[] = [];
     
      let paramIndex = 1;
     
      if (todoData.title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        values.push(todoData.title);
        paramIndex++;
      }
     
      if (todoData.completed !== undefined) {
        updates.push(`completed = $${paramIndex}`);
        values.push(todoData.completed);
        paramIndex++;
      }
     
      if (updates.length === 0) {
        return this.findById(id, userId);
      }
     
      values.push(id, userId);
     
      const query = `
        UPDATE todos
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
        RETURNING id, title, completed, created_at as "createdAt", user_id as "userId"
      `;
     
      const { rows } = await pool.query(query, values);
      return rows.length ? rows[0] : null;
    }
 
    async delete(id: string, userId: string): Promise<boolean> {
      const query = `
        DELETE FROM todos
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `;
     
      const { rowCount } = await pool.query(query, [id, userId]);
           
      return (rowCount || 0) > 0;
     
    }
  }
  
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@db:5432/todo_app',
});

export default pool;
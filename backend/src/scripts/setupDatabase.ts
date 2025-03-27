import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
 
dotenv.config();
 
const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
};
 
const dbName = process.env.DB_NAME || 'todo_app';
 
async function createDatabase() {
  // Connect to default postgres database to create new database
  const pool = new Pool({
    ...config,
    database: 'postgres',
  });
 
  try {
    // Check if database exists
    const res = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
 
    if (res.rowCount === 0) {
      // Create database if it doesn't exist
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}
 
async function runMigrations() {
  // Connect to the new database
  const pool = new Pool({
    ...config,
    database: dbName,
  });
 
  try {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
 
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
      console.log(`Completed migration: ${file}`);
    }
 
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    await pool.end();
  }
}
 
async function setupDatabase() {
  try {
    await createDatabase();
    await runMigrations();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}
 
setupDatabase();
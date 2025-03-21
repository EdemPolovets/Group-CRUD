import fs from 'fs';
import path from 'path';
import pool from '../config/database';
 
async function runMigrations() {
  console.log('Starting database migrations...');
 
  try {
    const initSqlPath = path.join(__dirname, 'migrations', 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
   
    await pool.query(initSql);
   
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
 
runMigrations();
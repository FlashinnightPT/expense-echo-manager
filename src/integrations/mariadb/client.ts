
import mysql from 'mysql2/promise';

// Configuration for MariaDB connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'financialapp';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');

// Create a connection pool
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Helper function to execute queries
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to execute a single query and return the first result
export async function querySingle<T>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper function for inserting data
export async function insert(table: string, data: Record<string, any>): Promise<number> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  try {
    const [result] = await pool.execute(sql, values);
    return (result as any).insertId;
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  }
}

// Helper function for updating data
export async function update(table: string, data: Record<string, any>, whereClause: string, whereParams: any[] = []): Promise<number> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  
  try {
    const [result] = await pool.execute(sql, [...values, ...whereParams]);
    return (result as any).affectedRows;
  } catch (error) {
    console.error('Database update error:', error);
    throw error;
  }
}

// Helper function for deleting data
export async function remove(table: string, whereClause: string, whereParams: any[] = []): Promise<number> {
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  
  try {
    const [result] = await pool.execute(sql, whereParams);
    return (result as any).affectedRows;
  } catch (error) {
    console.error('Database delete error:', error);
    throw error;
  }
}

// Helper function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const sql = `SHOW TABLES LIKE ?`;
    const [rows] = await pool.execute(sql, [tableName]);
    return (rows as any[]).length > 0;
  } catch (error) {
    console.error('Error checking if table exists:', error);
    throw error;
  }
}

// Helper for transactions
export async function transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


// Real MariaDB client implementation for production use
import mysql from 'mysql2/promise';

// Configuration for MariaDB connection
const DB_HOST = import.meta.env.VITE_DB_HOST || '94.46.168.180';
const DB_USER = import.meta.env.VITE_DB_USER || 'gfin_admin';
const DB_PASSWORD = import.meta.env.VITE_DB_PASSWORD || 'P@gu89_lo#';
const DB_NAME = import.meta.env.VITE_DB_NAME || 'GFIN_DB';
const DB_PORT = parseInt(import.meta.env.VITE_DB_PORT || '3306');

// Create connection pool
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
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    connection.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Helper function to execute queries
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Query execution error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
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
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    const [result] = await pool.execute(sql, values);
    return (result as any).affectedRows;
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
}

// Helper function for updating data
export async function update(table: string, data: Record<string, any>, whereClause: string, whereParams: any[] = []): Promise<number> {
  try {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(data), ...whereParams];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    
    const [result] = await pool.execute(sql, values);
    return (result as any).affectedRows;
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
}

// Helper function for deleting data
export async function remove(table: string, whereClause: string, whereParams: any[] = []): Promise<number> {
  try {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    const [result] = await pool.execute(sql, whereParams);
    return (result as any).affectedRows;
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

// Helper function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const sql = `
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = ?
      AND table_name = ?
    `;
    
    const [rows] = await pool.execute(sql, [DB_NAME, tableName]);
    return (rows as any[])[0].count > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    throw error;
  }
}

// Helper for transactions
export async function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
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

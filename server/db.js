
const mysql = require('mysql2/promise');

const createPool = () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '94.46.168.180',
    user: process.env.DB_USER || 'gfin_admin',
    password: process.env.DB_PASSWORD || 'P@gu89_lo#',
    database: process.env.DB_NAME || 'GFIN_DB',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  return pool;
};

const testConnection = async (pool) => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection test successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

const executeQuery = async (pool, sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Query execution error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

module.exports = {
  createPool,
  testConnection,
  executeQuery
};

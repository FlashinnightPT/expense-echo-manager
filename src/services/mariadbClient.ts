
import mysql from 'mysql2/promise';

// Configuração do cliente MySQL/MariaDB
const poolConfig = {
  host: process.env.MARIADB_HOST || 'localhost',
  port: parseInt(process.env.MARIADB_PORT || '3306', 10),
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: 'GFIN_DB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Criação do pool de conexões
export const pool = mysql.createPool(poolConfig);

// Função para verificar se o banco de dados está conectado
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar com o MariaDB:', error);
    return false;
  }
};

// Função para executar consultas SQL
export const executeQuery = async <T>(
  sql: string, 
  params: any[] = []
): Promise<T[]> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
};

// Exporta o cliente MariaDB para uso nas classes de serviço
export const mariadbClient = {
  pool,
  checkConnection: checkDatabaseConnection,
  executeQuery
};

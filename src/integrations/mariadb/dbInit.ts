
import { query, tableExists, testConnection } from './client';
import { toast } from 'sonner';

/**
 * Initialize database schema for MariaDB
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log("Checking and creating database tables if needed...");
    
    // In browser environment, we'll assume tables exist
    // Create categories table if it doesn't exist
    if (!await tableExists('categories')) {
      console.log("Creating categories table...");
      await query(`
        CREATE TABLE categories (
          id VARCHAR(255) PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          name VARCHAR(255) NOT NULL,
          parentid VARCHAR(255),
          level INT NOT NULL DEFAULT 1,
          createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          isactive TINYINT(1) DEFAULT 1,
          isfixedexpense TINYINT(1) DEFAULT 0
        )
      `);
      console.log("Categories table created successfully");
    }
    
    // Create transactions table if it doesn't exist
    if (!await tableExists('transactions')) {
      console.log("Creating transactions table...");
      await query(`
        CREATE TABLE transactions (
          id VARCHAR(255) PRIMARY KEY,
          date DATE NOT NULL,
          createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          amount DECIMAL(10, 2) NOT NULL,
          description VARCHAR(255) NOT NULL,
          categoryid VARCHAR(255),
          type VARCHAR(50) NOT NULL
        )
      `);
      console.log("Transactions table created successfully");
    }
    
    // Create users table if it doesn't exist
    if (!await tableExists('users')) {
      console.log("Creating users table...");
      await query(`
        CREATE TABLE users (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255),
          role VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL,
          last_login TIMESTAMP NULL
        )
      `);
      console.log("Users table created successfully");
    }
    
    console.log("Database initialization completed successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    toast.error("Error initializing database: " + (error instanceof Error ? error.message : String(error)));
    return false;
  }
}

/**
 * Export testConnection from client.ts
 */
export { testConnection };

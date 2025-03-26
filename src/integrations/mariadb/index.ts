
import { initializeDatabase } from './dbInit';
import { testConnection } from './client';

/**
 * Initialize database connection and setup
 */
export async function initializeMariaDB(): Promise<boolean> {
  try {
    console.log("Initializing database connection...");
    
    // Test connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error("Could not connect to database");
      return false;
    }
    
    console.log("Connection successful, initializing database schema...");
    
    // Initialize database schema
    const isInitialized = await initializeDatabase();
    
    return isInitialized;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
}

export { query, querySingle, insert, update, remove, transaction, testConnection } from './client';

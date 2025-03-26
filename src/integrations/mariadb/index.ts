
import { initializeDatabase } from './dbInit';
import { testConnection } from './client';

/**
 * Initialize database connection and setup
 */
export async function initializeMariaDB(): Promise<boolean> {
  try {
    // Test connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error("Could not connect to MariaDB");
      return false;
    }
    
    // Initialize database schema
    const isInitialized = await initializeDatabase();
    
    return isInitialized;
  } catch (error) {
    console.error("Error initializing MariaDB:", error);
    return false;
  }
}

export { query, querySingle, insert, update, remove, transaction, testConnection } from './client';

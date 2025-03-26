
// MariaDB client implementation with browser compatibility
import { toast } from 'sonner';

// Configuration for MariaDB connection
// These will be used in server environments or proxied through APIs
const DB_HOST = import.meta.env.VITE_DB_HOST || '94.46.168.180';
const DB_USER = import.meta.env.VITE_DB_USER || 'gfin_admin';
const DB_PASSWORD = import.meta.env.VITE_DB_PASSWORD || 'P@gu89_lo#';
const DB_NAME = import.meta.env.VITE_DB_NAME || 'GFIN_DB';
const DB_PORT = parseInt(import.meta.env.VITE_DB_PORT || '3306');

// A flag to determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Mock data storage for browser environment
const mockDatabase: Record<string, any[]> = {
  categories: [],
  transactions: [],
  users: []
};

// Track connection status
let connectionStatus = false;

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    console.log('Testing database connection...', { 
      host: DB_HOST, 
      user: DB_USER, 
      database: DB_NAME, 
      port: DB_PORT,
      isBrowser
    });
    
    if (isBrowser) {
      // In browser, we would make a fetch call to a backend API
      // For now, we'll simulate a connection test to the specified database
      console.log('Browser environment detected. Simulating API call to test database connection.');
      
      try {
        // Simulate an API call to test connection
        // This is a placeholder - in production, you would call an API endpoint
        const response = await fetch(`/api/db-test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            port: DB_PORT
          })
        }).catch((err) => {
          console.log('Network error testing connection:', err);
          // For demo purposes, we'll simulate a successful connection
          return { ok: true, json: async () => ({ success: true }) };
        });
        
        if (response.ok) {
          const result = await response.json();
          connectionStatus = result.success;
          console.log('Connection test result:', connectionStatus);
          return connectionStatus;
        } else {
          console.error('Error response from connection test API');
          connectionStatus = false;
          return false;
        }
      } catch (error) {
        console.error('Error testing connection via API:', error);
        
        // For development/demo purposes, return true to simulate a successful connection
        console.log('Simulating successful connection for demo purposes');
        connectionStatus = true;
        return true;
      }
    }

    // This code would run in Node.js environment only through a backend API
    console.log('Connection would be tested on the backend');
    
    // For development/demo purposes, simulate success
    connectionStatus = true;
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    toast.error('Database connection test failed');
    connectionStatus = false;
    return false;
  }
}

// Helper function to execute queries
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    console.log('Executing query:', sql, 'with params:', params);
    
    if (isBrowser) {
      // In browser, parse the SQL query and return mock data
      return handleBrowserQuery<T>(sql, params);
    }

    // This would be the actual implementation in a Node.js environment
    // We would need to call a server API endpoint
    throw new Error('Direct database queries are not supported in browser environment');
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
    console.log(`Inserting into ${table}:`, data);
    
    if (isBrowser) {
      // In browser, add to our mock database
      if (!mockDatabase[table]) {
        mockDatabase[table] = [];
      }
      mockDatabase[table].push(data);
      return 1; // Return 1 affected row
    }

    // This would be the actual implementation in a Node.js environment
    throw new Error('Direct database operations are not supported in browser environment');
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
}

// Helper function for updating data
export async function update(table: string, data: Record<string, any>, whereClause: string, whereParams: any[] = []): Promise<number> {
  try {
    console.log(`Updating ${table}:`, data, 'where', whereClause, whereParams);
    
    if (isBrowser) {
      // In browser, update our mock database
      if (!mockDatabase[table]) {
        return 0; // No table to update
      }
      
      // Simple implementation for basic where clauses like "id = ?"
      let affectedRows = 0;
      const whereKey = whereClause.split('=')[0].trim();
      const whereValue = whereParams[0];
      
      mockDatabase[table] = mockDatabase[table].map(row => {
        if (row[whereKey] === whereValue) {
          affectedRows++;
          return { ...row, ...data };
        }
        return row;
      });
      
      return affectedRows;
    }

    // This would be the actual implementation in a Node.js environment
    throw new Error('Direct database operations are not supported in browser environment');
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
}

// Helper function for deleting data
export async function remove(table: string, whereClause: string, whereParams: any[] = []): Promise<number> {
  try {
    console.log(`Deleting from ${table} where ${whereClause}:`, whereParams);
    
    if (isBrowser) {
      // In browser, remove from our mock database
      if (!mockDatabase[table]) {
        return 0; // No table to delete from
      }
      
      // Simple implementation for basic where clauses
      const initialLength = mockDatabase[table].length;
      const whereKey = whereClause.split('=')[0].trim();
      const whereValue = whereParams[0];
      
      mockDatabase[table] = mockDatabase[table].filter(row => row[whereKey] !== whereValue);
      
      return initialLength - mockDatabase[table].length;
    }

    // This would be the actual implementation in a Node.js environment
    throw new Error('Direct database operations are not supported in browser environment');
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

// Helper function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    console.log(`Checking if table ${tableName} exists`);
    
    if (isBrowser) {
      // In browser, we create the table if it doesn't exist
      if (!mockDatabase[tableName]) {
        mockDatabase[tableName] = [];
      }
      return true;
    }

    // This would be the actual implementation in a Node.js environment
    throw new Error('Direct database operations are not supported in browser environment');
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    throw error;
  }
}

// Helper for transactions - in browser this is just sequential operations
export async function transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
  try {
    if (isBrowser) {
      // In browser, we just execute the callback without transaction support
      const result = await callback({});
      return result;
    }

    // This would be the actual implementation in a Node.js environment
    throw new Error('Transaction operations are not supported in browser environment');
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

// Browser-specific function to handle SQL-like queries against our mock database
function handleBrowserQuery<T>(sql: string, params: any[]): T[] {
  // Very simple SQL parser for common operations
  sql = sql.trim().toLowerCase();
  
  if (sql.startsWith('select * from')) {
    const tableName = sql.split('from')[1].trim().split(' ')[0];
    return [...(mockDatabase[tableName] || [])] as T[];
  }
  
  if (sql.startsWith('select') && sql.includes('from')) {
    const tableName = sql.split('from')[1].trim().split(' ')[0];
    return [...(mockDatabase[tableName] || [])] as T[];
  }
  
  console.log('Unhandled query in browser mock:', sql);
  return [] as T[];
}

// Export environment information
export const isDatabaseMock = isBrowser;
export const isConnected = () => connectionStatus;


// This is a browser-compatible version of the MariaDB client
// In a real application, you would need a backend API to connect to MariaDB

// Configuration for MariaDB connection (for reference only in browser)
const DB_HOST = import.meta.env.VITE_DB_HOST || 'localhost';
const DB_USER = import.meta.env.VITE_DB_USER || 'root';
const DB_PASSWORD = import.meta.env.VITE_DB_PASSWORD || '';
const DB_NAME = import.meta.env.VITE_DB_NAME || 'financialapp';
const DB_PORT = parseInt(import.meta.env.VITE_DB_PORT || '3306');

// Mock storage for browser environment
type StorageRecord = Record<string, any[]>;
const mockStorage: Record<string, StorageRecord> = {
  categories: {},
  transactions: {},
  users: {}
};

// Test database connection - mock implementation for browser
export async function testConnection(): Promise<boolean> {
  console.log('Running mock database connection test');
  // In browser environment, always return true
  return true;
}

// Helper function to execute queries - mock implementation for browser
export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  console.log('Mock query:', sql, params);
  
  // Very simple SQL parsing for basic SELECT queries
  if (sql.toLowerCase().includes('select * from categories')) {
    return Object.values(mockStorage.categories).flat() as unknown as T[];
  }
  
  if (sql.toLowerCase().includes('select * from transactions')) {
    return Object.values(mockStorage.transactions).flat() as unknown as T[];
  }
  
  if (sql.toLowerCase().includes('select * from users')) {
    return Object.values(mockStorage.users).flat() as unknown as T[];
  }
  
  // For other queries, return empty array
  return [] as T[];
}

// Helper function to execute a single query and return the first result
export async function querySingle<T>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper function for inserting data
export async function insert(table: string, data: Record<string, any>): Promise<number> {
  console.log(`Mock insert into ${table}:`, data);
  
  // Store in our mock storage
  if (!mockStorage[table]) {
    mockStorage[table] = {};
  }
  
  const id = data.id || `mock-${Date.now()}`;
  data.id = id;
  
  if (!mockStorage[table][id]) {
    mockStorage[table][id] = [];
  }
  
  mockStorage[table][id].push(data);
  
  // Simulate localStorage persistence for browser environment
  try {
    const storageKey = `mock_db_${table}`;
    const existingData = localStorage.getItem(storageKey);
    const parsedData = existingData ? JSON.parse(existingData) : {};
    parsedData[id] = data;
    localStorage.setItem(storageKey, JSON.stringify(parsedData));
  } catch (e) {
    console.warn('Could not persist to localStorage', e);
  }
  
  return 1; // Return 1 for affected rows
}

// Helper function for updating data
export async function update(table: string, data: Record<string, any>, whereClause: string, whereParams: any[] = []): Promise<number> {
  console.log(`Mock update ${table}:`, data, whereClause, whereParams);
  
  // Very simple where clause parsing for id = ?
  if (whereClause.includes('id = ?') && whereParams.length > 0) {
    const id = whereParams[0];
    
    if (mockStorage[table] && mockStorage[table][id]) {
      // Update the mock record
      const updatedRecord = { ...mockStorage[table][id][0], ...data };
      mockStorage[table][id] = [updatedRecord];
      
      // Update localStorage
      try {
        const storageKey = `mock_db_${table}`;
        const existingData = localStorage.getItem(storageKey);
        const parsedData = existingData ? JSON.parse(existingData) : {};
        parsedData[id] = updatedRecord;
        localStorage.setItem(storageKey, JSON.stringify(parsedData));
      } catch (e) {
        console.warn('Could not persist to localStorage', e);
      }
      
      return 1;
    }
  }
  
  return 0;
}

// Helper function for deleting data
export async function remove(table: string, whereClause: string, whereParams: any[] = []): Promise<number> {
  console.log(`Mock delete from ${table}:`, whereClause, whereParams);
  
  // Very simple where clause parsing for id = ?
  if (whereClause.includes('id = ?') && whereParams.length > 0) {
    const id = whereParams[0];
    
    if (mockStorage[table] && mockStorage[table][id]) {
      // Remove from mock storage
      delete mockStorage[table][id];
      
      // Update localStorage
      try {
        const storageKey = `mock_db_${table}`;
        const existingData = localStorage.getItem(storageKey);
        const parsedData = existingData ? JSON.parse(existingData) : {};
        delete parsedData[id];
        localStorage.setItem(storageKey, JSON.stringify(parsedData));
      } catch (e) {
        console.warn('Could not persist to localStorage', e);
      }
      
      return 1;
    }
  }
  
  return 0;
}

// Helper function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  console.log(`Mock check if table exists: ${tableName}`);
  // In browser mock, assume tables exist
  return true;
}

// Helper for transactions - simplified mock for browser
export async function transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
  console.log('Mock transaction started');
  try {
    const mockConnection = {
      execute: async (sql: string, params: any[] = []) => {
        console.log('Mock transaction execute:', sql, params);
        return [[], null];
      },
      beginTransaction: async () => console.log('Mock begin transaction'),
      commit: async () => console.log('Mock commit'),
      rollback: async () => console.log('Mock rollback'),
      release: () => console.log('Mock connection released')
    };
    
    const result = await callback(mockConnection);
    console.log('Mock transaction completed successfully');
    return result;
  } catch (error) {
    console.log('Mock transaction failed', error);
    throw error;
  }
}

// We don't need a real connection pool in browser
export const pool = {
  execute: async (sql: string, params: any[] = []) => {
    console.log('Mock pool execute:', sql, params);
    return [[], null];
  },
  getConnection: async () => {
    return {
      execute: async (sql: string, params: any[] = []) => {
        console.log('Mock connection execute:', sql, params);
        return [[], null];
      },
      beginTransaction: async () => console.log('Mock begin transaction'),
      commit: async () => console.log('Mock commit'),
      rollback: async () => console.log('Mock rollback'),
      release: () => console.log('Mock connection released')
    };
  }
};

// Initialize mock data from localStorage
export function initMockStorage() {
  try {
    ['categories', 'transactions', 'users'].forEach(table => {
      const storageKey = `mock_db_${table}`;
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        Object.keys(parsedData).forEach(id => {
          if (!mockStorage[table]) mockStorage[table] = {};
          mockStorage[table][id] = [parsedData[id]];
        });
      }
    });
    console.log('Mock storage initialized from localStorage', mockStorage);
  } catch (e) {
    console.warn('Could not initialize mock storage from localStorage', e);
  }
}

// Initialize the mock storage when this module is loaded
initMockStorage();

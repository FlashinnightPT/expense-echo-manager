import { toast } from "sonner";

// Core API Service class with functionality for API operations
export class ApiServiceCore {
  // Using protected instead of private to allow proper inheritance
  protected static instances: Record<string, any> = {};
  protected connected: boolean = false;
  protected pendingOperations: Array<() => Promise<void>> = [];
  protected apiBaseUrl: string = import.meta.env.VITE_API_URL || 'https://gestaofinanceira.acmorais.com/api';

  protected constructor() {
    // Initialize connection check
    this.checkConnection();
    
    // Monitor connection state
    window.addEventListener('online', () => {
      toast.success("Connection restored");
      this.checkConnection();
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.connected = false;
      toast.warning("No connection. Offline mode activated.");
    });
  }

  // Generic getInstance method to be used by child classes
  protected static getOrCreateInstance<T extends ApiServiceCore>(
    this: new () => T
  ): T {
    const className = this.name;
    if (!ApiServiceCore.instances[className]) {
      ApiServiceCore.instances[className] = new this();
    }
    return ApiServiceCore.instances[className] as T;
  }

  // Check connection with API server
  protected async checkConnection(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.apiBaseUrl}/ping`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      this.connected = response.ok;
      console.log(`API connection status: ${this.connected ? 'Connected' : 'Disconnected'}`);
    } catch (error) {
      this.connected = false;
      console.error("Error checking API connection:", error);
    }
  }

  // Method to synchronize pending data when back online
  protected async syncData(): Promise<void> {
    if (!this.connected) return;
    
    console.log("Synchronizing pending data with the server...");
    
    // Execute pending operations
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    
    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        console.error("Error synchronizing operation:", error);
        // Re-add operation to queue if it fails
        this.pendingOperations.push(operation);
      }
    }
    
    if (this.pendingOperations.length > 0) {
      toast.warning(`${this.pendingOperations.length} operations could not be synchronized.`);
    } else if (operations.length > 0) {
      toast.success("Data synchronized successfully!");
    }
  }

  // Method to check current connection
  public isConnected(): boolean {
    return this.connected && navigator.onLine;
  }
  
  // Method to add operation to queue when offline - now public
  public addPendingOperation(operation: () => Promise<void>): void {
    this.pendingOperations.push(operation);
    toast.info("Operation stored for later synchronization");
  }
  
  // API helper methods
  protected async apiGet<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }
  
  protected async apiPost<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }
  
  protected async apiPut<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }
  
  protected async apiDelete(endpoint: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
  
  // API test connection
  public async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.apiBaseUrl}/db-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error testing database connection:", error);
      return false;
    }
  }
}

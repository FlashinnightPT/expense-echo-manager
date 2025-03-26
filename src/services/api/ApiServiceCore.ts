
import { toast } from "sonner";
import { testConnection } from "@/integrations/mariadb/client";

// Core API Service class with functionality for MariaDB and fallback for localStorage
export class ApiServiceCore {
  // Using protected instead of private to allow proper inheritance
  protected static instances: Record<string, any> = {};
  protected connected: boolean = false;
  protected pendingOperations: Array<() => Promise<void>> = [];

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

  // Check connection with MariaDB
  protected async checkConnection(): Promise<void> {
    try {
      this.connected = await testConnection();
      console.log(`MariaDB connection status: ${this.connected ? 'Connected' : 'Disconnected'}`);
    } catch (error) {
      this.connected = false;
      console.error("Error checking MariaDB connection:", error);
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
}

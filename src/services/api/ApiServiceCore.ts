
import { toast } from "sonner";

// Core API Service class with functionality for API operations
export class ApiServiceCore {
  // Using protected instead of private to allow proper inheritance
  protected static instances: Record<string, any> = {};
  protected apiBaseUrl: string = import.meta.env.VITE_API_URL || 'https://gestaofinanceira.acmorais.com/api';

  protected constructor() {
    // Constructor is kept minimal
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

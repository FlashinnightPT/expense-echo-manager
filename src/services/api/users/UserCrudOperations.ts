
import { UserData } from "./UserData";
import { ApiServiceCore } from "../ApiServiceCore";
import { dbToUserModel, userModelToDb } from "@/utils/supabaseAdapters";
import { toast } from "sonner";

export class UserCrudOperations {
  private apiCore: ApiServiceCore;

  constructor(apiCore: ApiServiceCore) {
    this.apiCore = apiCore;
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<UserData[]> {
    try {
      if (this.apiCore.isConnected()) {
        const data = await this.apiCore['apiGet']<any[]>('/users');
        return data.map(dbToUserModel);
      }
      
      // Use localStorage when offline
      const savedUsers = localStorage.getItem('app_users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      // In case of error, try to use localStorage
      const savedUsers = localStorage.getItem('app_users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      if (this.apiCore.isConnected()) {
        const data = await this.apiCore['apiGet']<any>(`/users/username/${username}`);
        return dbToUserModel(data);
      }
      
      // Use localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      return users.find((u: UserData) => u.username === username) || null;
    } catch (error) {
      console.error(`Error getting user ${username}:`, error);
      // In case of error, try to use localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      return users.find((u: UserData) => u.username === username) || null;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserData): Promise<UserData> {
    try {
      if (this.apiCore.isConnected()) {
        const dbUser = userModelToDb(userData);
        const result = await this.apiCore['apiPost']<any>('/users', dbUser);
        return dbToUserModel(result);
      }
      
      // Save to localStorage when offline
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      localStorage.setItem('app_users', JSON.stringify([...users, userData]));
      
      return userData;
    } catch (error) {
      console.error('Error creating user:', error);
      // In case of error, save only to localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      localStorage.setItem('app_users', JSON.stringify([...users, userData]));
      return userData;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(userData: Partial<UserData> & { id: string }): Promise<UserData | null> {
    try {
      if (this.apiCore.isConnected()) {
        const dbUser = userModelToDb(userData);
        const result = await this.apiCore['apiPut']<any>(`/users/${userData.id}`, dbUser);
        return dbToUserModel(result);
      }
      
      // Update localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const updatedUsers = users.map((u: UserData) => 
        u.id === userData.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      
      const updatedUser = users.find((u: UserData) => u.id === userData.id);
      return updatedUser ? { ...updatedUser, ...userData } : null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      if (this.apiCore.isConnected()) {
        await this.apiCore['apiDelete'](`/users/${userId}`);
      }
      
      // Update localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const filteredUsers = users.filter((u: UserData) => u.id !== userId);
      localStorage.setItem('app_users', JSON.stringify(filteredUsers));
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
  
  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      if (this.apiCore.isConnected()) {
        await this.apiCore['apiPut'](`/users/${userId}/last-login`, {});
      }
      
      // Also update in localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const updatedUsers = users.map((u: UserData) => 
        u.id === userId ? { ...u, lastLogin: new Date().toISOString() } : u
      );
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error updating last login:', error);
      toast.error('Error updating last login');
    }
  }
}

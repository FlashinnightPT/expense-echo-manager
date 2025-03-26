
import { UserData } from "./UserData";
import { ApiServiceCore } from "../ApiServiceCore";
import { dbToUserModel, userModelToDb } from "@/utils/supabaseAdapters";

// Mock users storage
const mockUsers: Record<string, any[]> = { users: [] };

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
      // Save to mock storage and localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      localStorage.setItem('app_users', JSON.stringify([...users, userData]));
      
      // Add to mock storage
      if (!mockUsers.users) {
        mockUsers.users = [];
      }
      mockUsers.users.push(userModelToDb(userData));
      
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
      // Update localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const updatedUsers = users.map((u: UserData) => 
        u.id === userData.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      
      // Update mock storage
      if (mockUsers.users) {
        mockUsers.users = mockUsers.users.map((u: any) => 
          u.id === userData.id ? { ...u, ...userModelToDb(userData) } : u
        );
      }
      
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
      // Update localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const filteredUsers = users.filter((u: UserData) => u.id !== userId);
      localStorage.setItem('app_users', JSON.stringify(filteredUsers));
      
      // Update mock storage
      if (mockUsers.users) {
        mockUsers.users = mockUsers.users.filter((u: any) => u.id !== userId);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

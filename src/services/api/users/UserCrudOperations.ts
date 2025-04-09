
import { UserData } from './UserData';
import { ApiServiceCore } from '../ApiServiceCore';
import { dbToUserModel } from '@/utils/supabaseAdapters';

export class UserCrudOperations {
  private apiService: ApiServiceCore;
  
  constructor(apiService: ApiServiceCore) {
    this.apiService = apiService;
  }
  
  // Get all users
  async getUsers(): Promise<UserData[]> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const users = await response.json();
      return users.map((user: any) => dbToUserModel(user));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  
  // Get user by username
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/username/${username}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const user = await response.json();
      return dbToUserModel(user);
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }
  
  // Create a new user
  async createUser(userData: UserData): Promise<UserData> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const createdUser = await response.json();
      return dbToUserModel(createdUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update an existing user
  async updateUser(userData: Partial<UserData> & { id: string }): Promise<UserData | null> {
    try {
      const { id, ...updates } = userData;
      
      // Ensure that the id is provided
      if (!id) {
        throw new Error('User ID is required for updating user');
      }
      
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const updatedUser = await response.json();
      return dbToUserModel(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

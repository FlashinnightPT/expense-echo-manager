import { v4 as uuidv4 } from 'uuid';
import { UserData } from './UserData';
import { ApiServiceCore } from '../ApiServiceCore';
import { dbToUserModel } from '@/utils/supabaseAdapters';
import { query, insert, update, remove } from '@/integrations/mariadb';

export class UserCrudOperations {
  private apiService: ApiServiceCore;
  
  constructor(apiService: ApiServiceCore) {
    this.apiService = apiService;
  }
  
  // Get all users
  async getUsers(): Promise<UserData[]> {
    try {
      // First attempt to get users from the API
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/users`);
          if (response.ok) {
            const users = await response.json();
            return users.map((user: any) => dbToUserModel(user));
          }
        } catch (error) {
          console.warn("API fetch failed, falling back to local data:", error);
        }
      }
      
      // Fallback to local data
      const users = await query<any>('SELECT * FROM users');
      return users.map(dbToUserModel);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  
  // Get user by username
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      // First attempt to get user from the API
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl) {
        try {
          const response = await fetch(`${apiUrl}/users/username/${username}`);
          if (response.ok) {
            const user = await response.json();
            return dbToUserModel(user);
          } else if (response.status === 404) {
            return null;
          }
        } catch (error) {
          console.warn("API fetch failed, falling back to local data:", error);
        }
      }
      
      // Fallback to local data
      const users = await query<any>('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length === 0) {
        return null;
      }
      return dbToUserModel(users[0]);
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }
  
  // Create a new user
  async createUser(userData: UserData): Promise<UserData> {
    try {
      const newUser = { ...userData, id: uuidv4() };
      await insert('users', newUser);
      return newUser;
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
      
      // Update the user in the database
      const affectedRows = await update('users', updates, 'id = ?', [id]);
      
      if (affectedRows === 0) {
        console.warn(`User with ID ${id} not found for update`);
        return null;
      }
      
      // Fetch the updated user
      const updatedUser = await this.getUserByUsername(userData.username || '');
      
      if (!updatedUser) {
        console.warn(`Could not retrieve updated user with ID ${id}`);
        return null;
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const affectedRows = await remove('users', 'id = ?', [userId]);
      return affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}


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
      const data = await this.apiCore['apiGet']<any[]>('/users');
      return data.map(dbToUserModel);
    } catch (error) {
      console.error('Error getting users:', error);
      toast.error('Failed to load users from API');
      return [];
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      const data = await this.apiCore['apiGet']<any>(`/users/username/${username}`);
      return dbToUserModel(data);
    } catch (error) {
      console.error(`Error getting user ${username}:`, error);
      toast.error(`Failed to load user ${username} from API`);
      return null;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserData): Promise<UserData> {
    try {
      const dbUser = userModelToDb(userData);
      const result = await this.apiCore['apiPost']<any>('/users', dbUser);
      toast.success(`User ${userData.name} created successfully`);
      return dbToUserModel(result);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user in API');
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(userData: Partial<UserData> & { id: string }): Promise<UserData | null> {
    try {
      const dbUser = userModelToDb(userData);
      const result = await this.apiCore['apiPut']<any>(`/users/${userData.id}`, dbUser);
      toast.success('User updated successfully');
      return dbToUserModel(result);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user in API');
      return null;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.apiCore['apiDelete'](`/users/${userId}`);
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user from API');
      return false;
    }
  }
  
  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.apiCore['apiPut'](`/users/${userId}/last-login`, {});
    } catch (error) {
      console.error('Error updating last login:', error);
      // Non-critical operation, so just log the error
    }
  }
}

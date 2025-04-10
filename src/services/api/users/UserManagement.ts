
import { UserCrudOperations } from './UserCrudOperations';

export class UserManagement {
  private userCrudOps: UserCrudOperations;

  constructor(userCrudOps: UserCrudOperations) {
    this.userCrudOps = userCrudOps;
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/users/${userId}/last-login`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      console.log('Last login updated successfully');
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  async initializeDefaultAdmin(): Promise<void> {
    try {
      // Check if there's at least one user in the system
      const users = await this.userCrudOps.getUsers();
      
      if (users.length === 0) {
        console.log('No users found, creating default admin account');
        
        // Create default admin user
        await this.userCrudOps.createUser({
          id: 'admin-' + Date.now(),
          name: 'Admin',
          username: 'admin',
          password: 'admin123', // This should be changed immediately
          role: 'editor',
          status: 'active'
        });
        
        console.log('Default admin account created');
      }
    } catch (error) {
      console.error('Failed to initialize default admin:', error);
    }
  }
}

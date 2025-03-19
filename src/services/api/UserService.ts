
import { ApiServiceCore } from './ApiServiceCore';
import { UserData } from './users/UserData';
import { UserCrudOperations } from './users/UserCrudOperations';
import { UserManagement } from './users/UserManagement';

class UserServiceClass extends ApiServiceCore {
  private static instance: UserServiceClass;
  private userCrudOps: UserCrudOperations;
  private userManagement: UserManagement;

  private constructor() {
    super();
    this.userCrudOps = new UserCrudOperations(this);
    this.userManagement = new UserManagement(this.userCrudOps);
  }

  public static getInstance(): UserServiceClass {
    if (!UserServiceClass.instance) {
      UserServiceClass.instance = new UserServiceClass();
    }
    return UserServiceClass.instance;
  }

  // Delegating to UserCrudOperations
  async getUsers(): Promise<UserData[]> {
    return this.userCrudOps.getUsers();
  }

  async getUserByUsername(username: string): Promise<UserData | null> {
    return this.userCrudOps.getUserByUsername(username);
  }

  async createUser(userData: UserData): Promise<UserData> {
    return this.userCrudOps.createUser(userData);
  }

  async updateUser(userData: Partial<UserData> & { id: string }): Promise<UserData | null> {
    return this.userCrudOps.updateUser(userData);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return this.userCrudOps.deleteUser(userId);
  }

  // Delegating to UserManagement
  async updateLastLogin(userId: string): Promise<void> {
    return this.userManagement.updateLastLogin(userId);
  }

  async initializeDefaultAdmin(): Promise<void> {
    return this.userManagement.initializeDefaultAdmin();
  }
}

export const UserService = UserServiceClass.getInstance();
export type { UserData } from './users/UserData';

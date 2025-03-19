
import { UserData } from './UserData';
import { UserCrudOperations } from './UserCrudOperations';

export class UserManagement {
  private userCrudOps: UserCrudOperations;

  constructor(userCrudOps: UserCrudOperations) {
    this.userCrudOps = userCrudOps;
  }

  /**
   * Atualizar o último login de um utilizador
   */
  async updateLastLogin(userId: string): Promise<void> {
    const lastLogin = new Date().toISOString();
    await this.userCrudOps.updateUser({
      id: userId,
      status: 'active',
      lastLogin
    });
  }

  /**
   * Inicializar o utilizador administrador padrão se não existir nenhum utilizador
   */
  async initializeDefaultAdmin(): Promise<void> {
    const users = await this.userCrudOps.getUsers();
    
    if (!users || users.length === 0) {
      const defaultAdmin: UserData = {
        id: "1",
        name: "Administrador",
        username: "admin",
        password: "admin123", // Para validação inicial
        role: "editor",
        status: "active",
        lastLogin: new Date().toISOString()
      };
      
      await this.userCrudOps.createUser(defaultAdmin);
      console.log("Utilizador administrador padrão criado");
    }
  }
}

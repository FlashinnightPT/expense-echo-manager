
import { mariadbClient } from '../../mariadbClient';
import { UserData } from './UserData';
import { ApiServiceCore } from '../ApiServiceCore';

export class UserCrudOperations {
  private apiCore: ApiServiceCore;

  constructor(apiCore: ApiServiceCore) {
    this.apiCore = apiCore;
  }

  /**
   * Obter todos os utilizadores
   */
  async getUsers(): Promise<UserData[]> {
    try {
      if (this.apiCore.isConnected()) {
        const data = await mariadbClient.executeQuery<UserData>('SELECT * FROM users');
        return data || [];
      } else {
        // Fallback para localStorage quando offline
        const savedUsers = localStorage.getItem('app_users');
        return savedUsers ? JSON.parse(savedUsers) : [];
      }
    } catch (error) {
      console.error('Erro ao obter utilizadores:', error);
      // Em caso de erro, tentar usar o localStorage
      const savedUsers = localStorage.getItem('app_users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    }
  }

  /**
   * Obter um utilizador pelo username
   */
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      if (this.apiCore.isConnected()) {
        const data = await mariadbClient.executeQuery<UserData>(
          'SELECT * FROM users WHERE username = ?',
          [username]
        );

        return data && data.length > 0 ? data[0] : null;
      } else {
        // Fallback para localStorage quando offline
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        return users.find((u: UserData) => u.username === username) || null;
      }
    } catch (error) {
      console.error(`Erro ao obter utilizador ${username}:`, error);
      // Em caso de erro, tentar usar o localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      return users.find((u: UserData) => u.username === username) || null;
    }
  }

  /**
   * Criar um novo utilizador
   */
  async createUser(userData: UserData): Promise<UserData> {
    try {
      if (this.apiCore.isConnected()) {
        await mariadbClient.executeQuery(
          'INSERT INTO users (id, name, username, password, role, status, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            userData.id,
            userData.name,
            userData.username,
            userData.password,
            userData.role,
            userData.status,
            userData.lastLogin
          ]
        );
        
        // Atualizar também o localStorage para manter sincronizado
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        localStorage.setItem('app_users', JSON.stringify([...users, userData]));
        
        return userData;
      } else {
        // Em modo offline, salvar apenas no localStorage
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        localStorage.setItem('app_users', JSON.stringify([...users, userData]));
        
        // Now using the public method
        this.apiCore.addPendingOperation(async () => {
          await this.createUser(userData);
        });
        
        return userData;
      }
    } catch (error) {
      console.error('Erro ao criar utilizador:', error);
      // Em caso de erro, salvar apenas no localStorage
      const savedUsers = localStorage.getItem('app_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      localStorage.setItem('app_users', JSON.stringify([...users, userData]));
      return userData;
    }
  }

  /**
   * Atualizar um utilizador existente
   */
  async updateUser(userData: Partial<UserData> & { id: string }): Promise<UserData | null> {
    try {
      if (this.apiCore.isConnected()) {
        // Construir a query de update dinamicamente
        const fields: string[] = [];
        const values: any[] = [];
        
        if (userData.name) {
          fields.push('name = ?');
          values.push(userData.name);
        }
        
        if (userData.username) {
          fields.push('username = ?');
          values.push(userData.username);
        }
        
        if (userData.password) {
          fields.push('password = ?');
          values.push(userData.password);
        }
        
        if (userData.role) {
          fields.push('role = ?');
          values.push(userData.role);
        }
        
        if (userData.status) {
          fields.push('status = ?');
          values.push(userData.status);
        }
        
        if (userData.lastLogin) {
          fields.push('last_login = ?');
          values.push(userData.lastLogin);
        }
        
        // Adicionar o ID para a cláusula WHERE
        values.push(userData.id);
        
        if (fields.length > 0) {
          await mariadbClient.executeQuery(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
          );
        }
        
        // Obter o usuário atualizado
        const data = await mariadbClient.executeQuery<UserData>(
          'SELECT * FROM users WHERE id = ?',
          [userData.id]
        );
        
        // Atualizar também o localStorage
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const updatedUsers = users.map((u: UserData) => 
          u.id === userData.id ? { ...u, ...userData } : u
        );
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        
        return data && data.length > 0 ? data[0] : null;
      } else {
        // Em modo offline, atualizar apenas no localStorage
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const updatedUsers = users.map((u: UserData) => 
          u.id === userData.id ? { ...u, ...userData } : u
        );
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        
        // Now using the public method
        this.apiCore.addPendingOperation(async () => {
          await this.updateUser(userData);
        });
        
        const updatedUser = users.find((u: UserData) => u.id === userData.id);
        return updatedUser ? { ...updatedUser, ...userData } : null;
      }
    } catch (error) {
      console.error('Erro ao atualizar utilizador:', error);
      return null;
    }
  }

  /**
   * Eliminar um utilizador
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      if (this.apiCore.isConnected()) {
        await mariadbClient.executeQuery(
          'DELETE FROM users WHERE id = ?',
          [userId]
        );
        
        // Atualizar também o localStorage
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const filteredUsers = users.filter((u: UserData) => u.id !== userId);
        localStorage.setItem('app_users', JSON.stringify(filteredUsers));
        
        return true;
      } else {
        // Em modo offline, eliminar apenas do localStorage
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const filteredUsers = users.filter((u: UserData) => u.id !== userId);
        localStorage.setItem('app_users', JSON.stringify(filteredUsers));
        
        // Now using the public method
        this.apiCore.addPendingOperation(async () => {
          await this.deleteUser(userId);
        });
        
        return true;
      }
    } catch (error) {
      console.error('Erro ao eliminar utilizador:', error);
      return false;
    }
  }
}

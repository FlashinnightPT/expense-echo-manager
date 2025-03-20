
import { supabase } from '../../supabaseClient';
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
        const { data, error } = await supabase
          .from('users')
          .select('*');

        if (error) throw error;
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
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
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
        const { data, error } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single();

        if (error) throw error;
        
        // Atualizar também o localStorage para manter sincronizado
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        localStorage.setItem('app_users', JSON.stringify([...users, userData]));
        
        return data;
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
        const { data, error } = await supabase
          .from('users')
          .update(userData)
          .eq('id', userData.id)
          .select()
          .single();

        if (error) throw error;
        
        // Atualizar também o localStorage
        const savedUsers = localStorage.getItem('app_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const updatedUsers = users.map((u: UserData) => 
          u.id === userData.id ? { ...u, ...userData } : u
        );
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        
        return data;
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
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (error) throw error;
        
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

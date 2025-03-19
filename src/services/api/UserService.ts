
import { ApiServiceCore } from './ApiServiceCore';
import { supabase } from '../supabaseClient';
import { UserRole } from '@/hooks/auth';

export interface UserData {
  id: string;
  name: string;
  username: string;
  password?: string; // Usado apenas para validação temporária
  role: UserRole;
  status: 'active' | 'pending' | 'inactive';
  lastLogin?: string;
}

class UserServiceClass extends ApiServiceCore {
  private static instance: UserServiceClass;

  private constructor() {
    super();
  }

  public static getInstance(): UserServiceClass {
    if (!UserServiceClass.instance) {
      UserServiceClass.instance = new UserServiceClass();
    }
    return UserServiceClass.instance;
  }

  /**
   * Obter todos os utilizadores
   */
  async getUsers(): Promise<UserData[]> {
    try {
      if (this.isConnected()) {
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
      if (this.isConnected()) {
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
      if (this.isConnected()) {
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
        
        // Adicionar à fila de operações pendentes
        this.addPendingOperation(async () => {
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
      if (this.isConnected()) {
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
        
        // Adicionar à fila de operações pendentes
        this.addPendingOperation(async () => {
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
      if (this.isConnected()) {
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
        
        // Adicionar à fila de operações pendentes
        this.addPendingOperation(async () => {
          await this.deleteUser(userId);
        });
        
        return true;
      }
    } catch (error) {
      console.error('Erro ao eliminar utilizador:', error);
      return false;
    }
  }

  /**
   * Atualizar o último login de um utilizador
   */
  async updateLastLogin(userId: string): Promise<void> {
    const lastLogin = new Date().toISOString();
    await this.updateUser({
      id: userId,
      status: 'active',
      lastLogin
    });
  }

  /**
   * Inicializar o utilizador administrador padrão se não existir nenhum utilizador
   */
  async initializeDefaultAdmin(): Promise<void> {
    const users = await this.getUsers();
    
    if (!users || users.length === 0) {
      const defaultAdmin = {
        id: "1",
        name: "Administrador",
        username: "admin",
        password: "admin123", // Para validação inicial
        role: "editor" as UserRole,
        status: "active",
        lastLogin: new Date().toISOString()
      };
      
      await this.createUser(defaultAdmin);
      console.log("Utilizador administrador padrão criado");
    }
  }
}

export const UserService = UserServiceClass.getInstance();


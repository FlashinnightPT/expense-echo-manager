
import { TransactionCategory } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

// Service specifically for category operations
export class CategoryService extends ApiServiceCore {
  private constructor() {
    super();
    this.ensureTableExists();
  }

  public static getInstance(): CategoryService {
    return ApiServiceCore.getOrCreateInstance.call(CategoryService);
  }
  
  // Garantir que a tabela existe no Supabase
  private async ensureTableExists(): Promise<void> {
    try {
      // Este método apenas verifica se conseguimos acessar a tabela
      // A criação real da tabela deve ser feita no console do Supabase
      const { error } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (error) {
        console.warn('Tabela de categorias pode não existir:', error.message);
      }
    } catch (error) {
      console.error('Erro ao verificar tabela de categorias:', error);
    }
  }

  public async getCategories(): Promise<TransactionCategory[]> {
    if (this.isConnected()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) throw error;
        
        // Atualizar o localStorage como cache
        localStorage.setItem('categories', JSON.stringify(data || []));
        
        return data || [];
      } catch (error) {
        console.error("Erro ao buscar categorias do Supabase:", error);
        toast.error("Erro ao buscar categorias. Usando dados em cache.");
        
        // Fallback para localStorage
        const storedCategories = localStorage.getItem('categories');
        return storedCategories ? JSON.parse(storedCategories) : [];
      }
    } else {
      // Modo offline - usar localStorage
      const storedCategories = localStorage.getItem('categories');
      return new Promise((resolve) => {
        setTimeout(() => {
          const categories = storedCategories ? JSON.parse(storedCategories) : [];
          resolve(categories);
        }, 300);
      });
    }
  }

  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    const newCategory: TransactionCategory = {
      id: category.id || `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
    };
    
    if (this.isConnected()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([newCategory])
          .select()
          .single();
        
        if (error) throw error;
        
        // Atualizar cache local
        const categories = await this.getCategories();
        const updatedCategories = [...categories, data || newCategory];
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        return data || newCategory;
      } catch (error) {
        console.error("Erro ao salvar categoria no Supabase:", error);
        toast.error("Erro ao salvar categoria online. Salvando localmente.");
        
        // Adicionar operação à fila para sincronizar depois
        this.addPendingOperation(async () => {
          await this.saveCategory(newCategory);
        });
        
        // Salvar localmente como fallback
        const storedCategories = localStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        const updatedCategories = [...categories, newCategory];
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        window.dispatchEvent(new Event('storage'));
        
        return newCategory;
      }
    } else {
      // Modo offline - salvar no localStorage e adicionar à fila
      return new Promise((resolve) => {
        setTimeout(async () => {
          const categories = await this.getCategories();
          const updatedCategories = [...categories, newCategory];
          localStorage.setItem('categories', JSON.stringify(updatedCategories));
          
          // Adicionar à fila para sincronizar quando online
          this.addPendingOperation(async () => {
            await this.saveCategory(newCategory);
          });
          
          // Simula evento para outros componentes
          window.dispatchEvent(new Event('storage'));
          
          resolve(newCategory);
        }, 500);
      });
    }
  }
  
  public async deleteCategory(categoryId: string): Promise<boolean> {
    if (this.isConnected()) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) throw error;
        
        // Atualizar cache local
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const updatedCategories = categories.filter((c: TransactionCategory) => c.id !== categoryId);
          localStorage.setItem('categories', JSON.stringify(updatedCategories));
        }
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        return true;
      } catch (error) {
        console.error("Erro ao excluir categoria do Supabase:", error);
        toast.error("Erro ao excluir categoria online. Excluindo localmente.");
        
        // Adicionar operação à fila para sincronizar depois
        this.addPendingOperation(async () => {
          await this.deleteCategory(categoryId);
        });
        
        // Excluir localmente como fallback
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const updatedCategories = categories.filter((c: TransactionCategory) => c.id !== categoryId);
          localStorage.setItem('categories', JSON.stringify(updatedCategories));
        }
        
        window.dispatchEvent(new Event('storage'));
        
        return true;
      }
    } else {
      // Modo offline - excluir do localStorage e adicionar à fila
      return new Promise((resolve) => {
        setTimeout(() => {
          const storedCategories = localStorage.getItem('categories');
          if (storedCategories) {
            const categories = JSON.parse(storedCategories);
            const updatedCategories = categories.filter((c: TransactionCategory) => c.id !== categoryId);
            localStorage.setItem('categories', JSON.stringify(updatedCategories));
          }
          
          // Adicionar à fila para sincronizar quando online
          this.addPendingOperation(async () => {
            await this.deleteCategory(categoryId);
          });
          
          // Simula evento para outros componentes
          window.dispatchEvent(new Event('storage'));
          
          resolve(true);
        }, 500);
      });
    }
  }
}

// Exporta a instância singleton
export const categoryService = CategoryService.getInstance();

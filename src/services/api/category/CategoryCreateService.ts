
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

// Class specifically for category creation operations
export class CategoryCreateService extends CategoryServiceBase {
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
        
        // Update local cache
        const categories = await this.getCategories();
        const updatedCategories = [...categories, data || newCategory];
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('storage'));
        
        return data || newCategory;
      } catch (error) {
        console.error("Erro ao salvar categoria no Supabase:", error);
        toast.error("Erro ao salvar categoria online. Salvando localmente.");
        
        // Add operation to queue for later sync
        this.addPendingOperation(async () => {
          await this.saveCategory(newCategory);
        });
        
        // Save locally as fallback
        const storedCategories = localStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        const updatedCategories = [...categories, newCategory];
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        window.dispatchEvent(new Event('storage'));
        
        return newCategory;
      }
    } else {
      // Offline mode - save to localStorage and add to queue
      return new Promise((resolve) => {
        setTimeout(async () => {
          const categories = await this.getCategories();
          const updatedCategories = [...categories, newCategory];
          localStorage.setItem('categories', JSON.stringify(updatedCategories));
          
          // Add to queue for sync when online
          this.addPendingOperation(async () => {
            await this.saveCategory(newCategory);
          });
          
          // Dispatch event for other components
          window.dispatchEvent(new Event('storage'));
          
          resolve(newCategory);
        }, 500);
      });
    }
  }
  
  // This method is needed by saveCategory but is defined in another service
  // We'll use a simple implementation here and rely on the main CategoryService
  // to properly wire things up
  private async getCategories(): Promise<TransactionCategory[]> {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : [];
  }
}

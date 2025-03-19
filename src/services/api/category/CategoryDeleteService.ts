
import { CategoryServiceBase } from "./CategoryServiceBase";
import { TransactionCategory } from "@/utils/mockData";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

// Class specifically for category deletion operations
export class CategoryDeleteService extends CategoryServiceBase {
  public async deleteCategory(categoryId: string): Promise<boolean> {
    if (this.isConnected()) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) throw error;
        
        // Update local cache
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          const updatedCategories = categories.filter((c: TransactionCategory) => c.id !== categoryId);
          localStorage.setItem('categories', JSON.stringify(updatedCategories));
        }
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('storage'));
        
        return true;
      } catch (error) {
        console.error("Erro ao excluir categoria do Supabase:", error);
        toast.error("Erro ao excluir categoria online. Excluindo localmente.");
        
        // Add operation to queue for later sync
        this.addPendingOperation(async () => {
          await this.deleteCategory(categoryId);
        });
        
        // Delete locally as fallback
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
      // Offline mode - delete from localStorage and add to queue
      return new Promise((resolve) => {
        setTimeout(() => {
          const storedCategories = localStorage.getItem('categories');
          if (storedCategories) {
            const categories = JSON.parse(storedCategories);
            const updatedCategories = categories.filter((c: TransactionCategory) => c.id !== categoryId);
            localStorage.setItem('categories', JSON.stringify(updatedCategories));
          }
          
          // Add to queue for sync when online
          this.addPendingOperation(async () => {
            await this.deleteCategory(categoryId);
          });
          
          // Dispatch event for other components
          window.dispatchEvent(new Event('storage'));
          
          resolve(true);
        }, 500);
      });
    }
  }
}

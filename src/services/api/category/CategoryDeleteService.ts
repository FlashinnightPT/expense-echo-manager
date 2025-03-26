
import { CategoryServiceBase } from "./CategoryServiceBase";
import { query, remove } from "@/integrations/mariadb/client";
import { toast } from "sonner";
import { TransactionCategory } from "@/utils/mockData";
import { dbToCategoryModel } from "@/utils/mariadbAdapters";

// Class specifically for category deletion operations
export class CategoryDeleteService extends CategoryServiceBase {
  public async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const affectedRows = await remove('categories', 'id = ?', [categoryId]);
      
      if (affectedRows === 0) {
        console.error("Error deleting category from MariaDB: No rows affected");
        toast.error("Error deleting category");
        return false;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error("Error deleting category from MariaDB:", error);
      toast.error("Error deleting category");
      return false;
    }
  }

  // Add function to clear all categories except level 1
  public async clearNonRootCategories(categories: TransactionCategory[]): Promise<TransactionCategory[]> {
    // Filter only the categories of level 1 (root)
    const rootCategories = categories.filter(cat => cat.level === 1);
    
    // Identify the categories to be removed
    const categoriesToRemove = categories.filter(cat => cat.level > 1);
    
    console.log("Cleaning categories. Keeping only", rootCategories.length, "root categories.");
    console.log("Categories to remove:", categoriesToRemove.length);
    
    // Also clean the categories in MariaDB
    if (categoriesToRemove.length > 0) {
      try {
        // Delete all categories that are not level 1
        const affectedRows = await query(`
          DELETE FROM categories WHERE level > 1
        `);
        
        console.log("Categories removed from MariaDB:", affectedRows);
        
        toast.success(`${categoriesToRemove.length} categories were removed successfully.`);
      } catch (error) {
        console.error("Error cleaning categories in MariaDB:", error);
        toast.error("Error cleaning categories in MariaDB");
      }
    } else {
      toast.info("No categories to remove.");
    }
    
    return rootCategories;
  }
}


import { CategoryServiceBase } from "./CategoryServiceBase";
import { toast } from "sonner";
import { TransactionCategory } from "@/utils/mockData";
import { dbToCategoryModel } from "@/utils/mariadbAdapters";

// Class specifically for category deletion operations
export class CategoryDeleteService extends CategoryServiceBase {
  public async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const success = await this.apiDelete(`/categories/${categoryId}`);
      
      if (!success) {
        console.error("Error deleting category from API");
        toast.error("Error deleting category");
        return false;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error("Error deleting category from API:", error);
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
    
    if (categoriesToRemove.length > 0) {
      try {
        // Delete all categories that are not level 1
        const result = await this.apiDelete('/categories/clear/non-root');
        
        console.log("Categories removed from API:", result);
        
        toast.success(`${categoriesToRemove.length} categories were removed successfully.`);
      } catch (error) {
        console.error("Error cleaning categories in API:", error);
        toast.error("Error cleaning categories");
      }
    } else {
      toast.info("No categories to remove.");
    }
    
    return rootCategories;
  }
}

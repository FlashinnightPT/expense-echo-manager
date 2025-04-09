
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { toast } from "sonner";

// Class specifically for category deletion operations
export class CategoryDeleteService extends CategoryServiceBase {
  public async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      await this.apiDelete(`/categories/${categoryId}`);
      return true;
    } catch (error) {
      console.error("Error deleting category from API:", error);
      toast.error("Error deleting category");
      return false;
    }
  }
  
  public async clearNonRootCategories(categories: TransactionCategory[]): Promise<TransactionCategory[]> {
    try {
      // Call API to clear non-root categories
      const response = await this.apiDelete('/categories/clear/non-root');
      
      if (response) {
        // Return only the root categories (level 1)
        const rootCategories = categories.filter(cat => cat.level === 1);
        toast.success("All non-root categories cleared successfully");
        return rootCategories;
      } else {
        toast.error("Error clearing non-root categories");
        return categories;
      }
    } catch (error) {
      console.error("Error clearing non-root categories:", error);
      toast.error("Error clearing non-root categories");
      return categories;
    }
  }
}

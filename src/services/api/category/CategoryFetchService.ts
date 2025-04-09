
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { toast } from "sonner";

// Class specifically for category fetch operations
export class CategoryFetchService extends CategoryServiceBase {
  public async getCategories(): Promise<TransactionCategory[]> {
    try {
      const data = await this.apiGet<any[]>('/categories');
      
      if (!data) {
        console.error("Error fetching categories from API: No data returned");
        toast.error("Error fetching categories");
        return [];
      }
      
      // Map API response to TransactionCategory model
      // Ensure type is correctly handled for display
      return data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type.toLowerCase(), // Ensure consistent lowercase format
        level: item.level,
        parentId: item.parentId || null,
        isFixedExpense: item.isFixedExpense || false,
        isActive: item.isActive !== undefined ? item.isActive : true,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
      }));
    } catch (error) {
      console.error("Error fetching categories from API:", error);
      toast.error("Error fetching categories.");
      return [];
    }
  }
}

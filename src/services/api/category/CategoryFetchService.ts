
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
      
      console.log("Raw API response:", data);
      
      // Map API response to TransactionCategory model
      // Handle Pascal case field names from API (Id, Name, Type, etc.)
      return data.map(item => ({
        id: item.Id || item.id,
        name: item.Name || item.name,
        type: (item.Type || item.type || "").toLowerCase(), // Ensure consistent lowercase format
        level: item.Level || item.level,
        parentId: item.ParentId || item.parentId || null,
        isFixedExpense: item.IsFixedExpense || item.isFixedExpense || false,
        isActive: item.IsActive !== undefined ? item.IsActive : (item.isActive !== undefined ? item.isActive : true),
        createdAt: item.CreatedAt ? new Date(item.CreatedAt) : (item.createdAt ? new Date(item.createdAt) : new Date())
      }));
    } catch (error) {
      console.error("Error fetching categories from API:", error);
      toast.error("Error fetching categories.");
      return [];
    }
  }
}

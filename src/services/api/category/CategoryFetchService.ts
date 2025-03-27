
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { toast } from "sonner";
import { dbToCategoryModel } from "@/utils/mariadbAdapters";

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
      
      // Transform database records to application model
      return (data || []).map(dbToCategoryModel);
    } catch (error) {
      console.error("Error fetching categories from API:", error);
      toast.error("Error fetching categories.");
      return [];
    }
  }
}

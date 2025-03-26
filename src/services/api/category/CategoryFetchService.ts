
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { query } from "@/integrations/mariadb/client";
import { toast } from "sonner";
import { dbToCategoryModel } from "@/utils/mariadbAdapters";

// Class specifically for category fetch operations
export class CategoryFetchService extends CategoryServiceBase {
  public async getCategories(): Promise<TransactionCategory[]> {
    try {
      const data = await query(`SELECT * FROM categories`);
      
      if (!data) {
        console.error("Error fetching categories from MariaDB: No data returned");
        toast.error("Error fetching categories from MariaDB");
        return [];
      }
      
      // Transform database records to application model
      return (data || []).map(dbToCategoryModel);
    } catch (error) {
      console.error("Error fetching categories from MariaDB:", error);
      toast.error("Error fetching categories.");
      return [];
    }
  }
}

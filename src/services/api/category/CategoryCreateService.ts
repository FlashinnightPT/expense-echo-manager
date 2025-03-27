
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { toast } from "sonner";
import { categoryModelToDb, dbToCategoryModel } from "@/utils/mariadbAdapters";

// Class specifically for category creation operations
export class CategoryCreateService extends CategoryServiceBase {
  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    const isNewCategory = !category.id;
    
    // For new categories, generate an ID
    if (isNewCategory) {
      category.id = `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Fix: Explicitly set boolean values
    const normalizedCategory: TransactionCategory = {
      id: category.id || "",
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
      // Fix: Explicitly convert to boolean values using strict comparison
      isFixedExpense: category.isFixedExpense === true ? true : false,
      isActive: category.isActive === false ? false : true // default to true if undefined
    };
    
    console.log("Category to save (normalized):", normalizedCategory);
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(normalizedCategory);
      
      console.log("Category formatted for DB:", dbCategory);
      
      let data;
      
      if (isNewCategory) {
        // If it's a new category, create it
        data = await this.apiPost('/categories', dbCategory);
      } else {
        // If it's an existing category, update it
        data = await this.apiPut(`/categories/${dbCategory.id}`, dbCategory);
      }
      
      if (!data) {
        console.error("Error saving category to API: No data returned");
        toast.error("Error saving category");
        return normalizedCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      console.log("Category saved to API (response):", data);
      
      // Convert from database format back to application model
      const convertedCategory = dbToCategoryModel(data);
      console.log("Category after conversion back:", convertedCategory);
      return convertedCategory || normalizedCategory;
    } catch (error) {
      console.error("Error saving category to API:", error);
      toast.error("Error saving category");
      return normalizedCategory;
    }
  }
}

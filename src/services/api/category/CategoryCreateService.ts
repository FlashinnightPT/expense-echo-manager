
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
    
    // Ensure boolean values are properly set
    // The key issue here is to preserve the exact boolean values provided
    const normalizedCategory: TransactionCategory = {
      id: category.id || "",
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: this.sanitizeForDb(category.parentId), // Sanitize parentId (convert undefined to null)
      
      // Use Boolean() constructor for consistency, but respect undefined values
      isFixedExpense: category.isFixedExpense !== undefined ? Boolean(category.isFixedExpense) : false,
      
      // For isActive, default to true if undefined
      isActive: category.isActive !== undefined ? Boolean(category.isActive) : true,
      
      createdAt: category.createdAt || new Date().toISOString()
    };
    
    console.log("Category to save (normalized):", {
      id: normalizedCategory.id,
      name: normalizedCategory.name,
      "isFixedExpense": normalizedCategory.isFixedExpense,
      "isFixedExpense type": typeof normalizedCategory.isFixedExpense,
      "isActive": normalizedCategory.isActive,
      "isActive type": typeof normalizedCategory.isActive
    });
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(normalizedCategory);
      
      console.log("Category formatted for DB:", {
        "id": dbCategory.id,
        "name": dbCategory.name,
        "isactive value": dbCategory.isactive,
        "isactive type": typeof dbCategory.isactive,
        "isfixedexpense value": dbCategory.isfixedexpense,
        "isfixedexpense type": typeof dbCategory.isfixedexpense
      });
      
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
      
      // Handle potential null response data by providing a fallback
      const convertedCategory = data ? dbToCategoryModel(data) : normalizedCategory;
      console.log("Category after conversion back:", convertedCategory);
      
      // Fix: Return a complete category object with all properties
      return {
        id: convertedCategory.id || normalizedCategory.id,
        name: convertedCategory.name || normalizedCategory.name,
        type: convertedCategory.type || normalizedCategory.type,
        level: convertedCategory.level || normalizedCategory.level,
        parentId: convertedCategory.parentId ?? normalizedCategory.parentId,
        isFixedExpense: convertedCategory.isFixedExpense ?? normalizedCategory.isFixedExpense,
        isActive: convertedCategory.isActive ?? normalizedCategory.isActive,
        createdAt: convertedCategory.createdAt || normalizedCategory.createdAt
      };
    } catch (error) {
      console.error("Error saving category to API:", error);
      toast.error("Error saving category");
      return normalizedCategory;
    }
  }
}

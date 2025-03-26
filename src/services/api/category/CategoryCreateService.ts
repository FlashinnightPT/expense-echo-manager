
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { query, insert, update } from "@/integrations/mariadb/client";
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
    console.log("isActive value:", normalizedCategory.isActive, "type:", typeof normalizedCategory.isActive);
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(normalizedCategory);
      
      console.log("Category formatted for DB:", dbCategory);
      console.log("isactive value after conversion:", dbCategory.isactive, "type:", typeof dbCategory.isactive);
      
      let data;
      
      if (isNewCategory) {
        // If it's a new category, use insert
        await insert('categories', dbCategory);
        
        // Retrieve the inserted category
        const [insertedCategory] = await query(`
          SELECT * FROM categories WHERE id = ?
        `, [dbCategory.id]);
        
        data = insertedCategory;
      } else {
        // FIX: Create an explicit update object with only the fields that should be updated
        // This ensures we're not sending null values and that booleans are properly handled
        const updateData = {
          name: dbCategory.name,
          isactive: dbCategory.isactive,
          isfixedexpense: dbCategory.isfixedexpense,
          type: dbCategory.type,
          level: dbCategory.level,
          parentid: dbCategory.parentid
        };
        
        console.log("Final update data:", updateData);
        
        // If it's an existing category, use update
        await update('categories', updateData, 'id = ?', [dbCategory.id]);
        
        // Retrieve the updated category
        const [updatedCategory] = await query(`
          SELECT * FROM categories WHERE id = ?
        `, [dbCategory.id]);
        
        data = updatedCategory;
        
        console.log("Update result:", data);
      }
      
      if (!data) {
        console.error("Error saving category to MariaDB: No data returned");
        toast.error("Error saving category to MariaDB");
        return normalizedCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      console.log("Category saved to MariaDB (response):", data);
      
      // Convert from database format back to application model
      const convertedCategory = dbToCategoryModel(data);
      console.log("Category after conversion back:", convertedCategory);
      return convertedCategory || normalizedCategory;
    } catch (error) {
      console.error("Error saving category to MariaDB:", error);
      toast.error("Error saving category");
      return normalizedCategory;
    }
  }
  
  // This method is needed by saveCategory but is defined in another service
  private async getCategories(): Promise<TransactionCategory[]> {
    try {
      const data = await query(`SELECT * FROM categories`);
      
      if (!data) throw new Error("No data returned");
      
      // Transform database records to application model
      return (data || []).map(dbToCategoryModel);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
}

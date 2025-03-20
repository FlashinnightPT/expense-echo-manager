
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { categoryModelToDb, dbToCategoryModel } from "@/utils/supabaseAdapters";

// Class specifically for category creation operations
export class CategoryCreateService extends CategoryServiceBase {
  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    const isNewCategory = !category.id;
    
    // For new categories, generate an ID
    if (isNewCategory) {
      category.id = `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Force boolean values using double negation to ensure they're actual booleans
    const normalizedCategory: TransactionCategory = {
      id: category.id || "",
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
      // Force boolean values with double negation
      isFixedExpense: !!category.isFixedExpense,
      isActive: category.isActive !== false // default to true if undefined, but ensure boolean
    };
    
    console.log("Category to save (normalized):", normalizedCategory);
    console.log("isActive value:", normalizedCategory.isActive, "type:", typeof normalizedCategory.isActive);
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(normalizedCategory);
      
      console.log("Category formatted for DB:", dbCategory);
      console.log("isactive value after conversion:", dbCategory.isactive, "type:", typeof dbCategory.isactive);
      
      let data;
      let error;
      
      if (isNewCategory) {
        // If it's a new category, use insert
        const result = await supabase
          .from('categories')
          .insert([dbCategory])
          .select()
          .single();
          
        data = result.data;
        error = result.error;
      } else {
        // Log exactly what will be updated
        console.log("UPDATING EXISTING CATEGORY:", {
          id: dbCategory.id,
          isactive: dbCategory.isactive,
          isfixedexpense: dbCategory.isfixedexpense,
          name: dbCategory.name,
          type: dbCategory.type,
          level: dbCategory.level,
          parentid: dbCategory.parentid
        });
        
        // Strip out null or undefined values to avoid overwriting with null
        const updateData = Object.fromEntries(
          Object.entries(dbCategory).filter(([_, v]) => v !== null && v !== undefined)
        );
        
        console.log("Final update data:", updateData);
        
        // If it's an existing category, use update
        const result = await supabase
          .from('categories')
          .update(updateData)
          .eq('id', dbCategory.id)
          .select()
          .single();
          
        data = result.data;
        error = result.error;
        
        console.log("Update result:", result);
      }
      
      if (error) {
        console.error("Error saving category to Supabase:", error);
        toast.error("Error saving category to Supabase");
        return normalizedCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      console.log("Category saved to Supabase (response):", data);
      
      // Convert from database format back to application model
      const convertedCategory = dbToCategoryModel(data);
      console.log("Category after conversion back:", convertedCategory);
      return convertedCategory || normalizedCategory;
    } catch (error) {
      console.error("Error saving category to Supabase:", error);
      toast.error("Error saving category");
      return normalizedCategory;
    }
  }
  
  // This method is needed by saveCategory but is defined in another service
  private async getCategories(): Promise<TransactionCategory[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      
      // Transform database records to application model
      return (data || []).map(dbToCategoryModel);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
}

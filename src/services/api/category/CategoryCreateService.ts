
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
    
    // Ensure all boolean values are explicitly defined
    const normalizedCategory: TransactionCategory = {
      id: category.id || "",
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
      // Force boolean values to be strictly boolean type
      isFixedExpense: Boolean(category.isFixedExpense),
      isActive: category.isActive !== false // default to true if undefined/null
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
        // If it's an existing category, use upsert with onConflict('id')
        console.log("UPDATING EXISTING CATEGORY:", dbCategory);
        const result = await supabase
          .from('categories')
          .upsert(dbCategory, { 
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select()
          .single();
          
        data = result.data;
        error = result.error;
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

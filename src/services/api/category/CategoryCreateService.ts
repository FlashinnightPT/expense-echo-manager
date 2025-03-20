
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { categoryModelToDb, dbToCategoryModel } from "@/utils/supabaseAdapters";

// Class specifically for category creation operations
export class CategoryCreateService extends CategoryServiceBase {
  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    const newCategory: TransactionCategory = {
      id: category.id || `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
    };
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(newCategory);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([dbCategory])
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao salvar categoria no Supabase:", error);
        toast.error("Erro ao salvar categoria no Supabase");
        return newCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      // Convert from database format back to application model
      return dbToCategoryModel(data) || newCategory;
    } catch (error) {
      console.error("Erro ao salvar categoria no Supabase:", error);
      toast.error("Erro ao salvar categoria");
      return newCategory;
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
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }
}

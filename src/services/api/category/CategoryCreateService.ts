
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao salvar categoria no Supabase:", error);
        toast.error("Erro ao salvar categoria no Supabase");
        return newCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      return data || newCategory;
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
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }
}

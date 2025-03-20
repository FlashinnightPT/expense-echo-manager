
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
    
    // Garantir explicitamente que os valores booleanos estão definidos corretamente
    // Usar explicitamente true/false em vez de conversões implícitas
    const isActive = category.isActive === undefined ? true : Boolean(category.isActive);
    const isFixedExpense = category.isFixedExpense === undefined ? false : Boolean(category.isFixedExpense);
    
    const newCategory: TransactionCategory = {
      id: category.id || "",
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
      isFixedExpense: isFixedExpense,
      isActive: isActive
    };
    
    console.log("Categoria a salvar (após normalização):", newCategory);
    console.log("isActive antes da conversão:", isActive, "tipo:", typeof isActive);
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(newCategory);
      
      console.log("Categoria formatada para BD antes de enviar:", dbCategory);
      console.log("isactive após conversão:", dbCategory.isactive, "tipo:", typeof dbCategory.isactive);
      
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
        const result = await supabase
          .from('categories')
          .upsert(dbCategory, { onConflict: 'id' })
          .select()
          .single();
          
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error("Erro ao salvar categoria no Supabase:", error);
        toast.error("Erro ao salvar categoria no Supabase");
        return newCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      console.log("Categoria salva no Supabase (resposta):", data);
      
      // Convert from database format back to application model
      const convertedCategory = dbToCategoryModel(data);
      console.log("Categoria após conversão de volta:", convertedCategory);
      return convertedCategory || newCategory;
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

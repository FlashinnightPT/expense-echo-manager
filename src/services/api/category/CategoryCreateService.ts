
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
    const normalizedCategory: TransactionCategory = {
      id: category.id || "",
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
      // Usar valores booleanos explícitos
      isFixedExpense: category.isFixedExpense === true,
      isActive: category.isActive !== false // default to true if undefined
    };
    
    console.log("Categoria a salvar (normalizada):", normalizedCategory);
    console.log("isActive valor:", normalizedCategory.isActive, "tipo:", typeof normalizedCategory.isActive);
    
    try {
      // Convert to database format
      const dbCategory = categoryModelToDb(normalizedCategory);
      
      console.log("Categoria formatada para BD:", dbCategory);
      console.log("isactive valor após conversão:", dbCategory.isactive, "tipo:", typeof dbCategory.isactive);
      
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
        return normalizedCategory;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      console.log("Categoria salva no Supabase (resposta):", data);
      
      // Convert from database format back to application model
      const convertedCategory = dbToCategoryModel(data);
      console.log("Categoria após conversão de volta:", convertedCategory);
      return convertedCategory || normalizedCategory;
    } catch (error) {
      console.error("Erro ao salvar categoria no Supabase:", error);
      toast.error("Erro ao salvar categoria");
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
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }
}

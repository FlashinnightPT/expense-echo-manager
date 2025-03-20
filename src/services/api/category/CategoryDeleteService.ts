
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TransactionCategory } from "@/utils/mockData";

// Class specifically for category deletion operations
export class CategoryDeleteService extends CategoryServiceBase {
  public async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        console.error("Erro ao excluir categoria do Supabase:", error);
        toast.error("Erro ao excluir categoria");
        return false;
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir categoria do Supabase:", error);
      toast.error("Erro ao excluir categoria");
      return false;
    }
  }

  // Adiciona função para limpar todas as categorias exceto as de nível 1
  public clearNonRootCategories(categories: TransactionCategory[]): TransactionCategory[] {
    // Filtra apenas as categorias de nível 1 (raiz)
    const rootCategories = categories.filter(cat => cat.level === 1);
    
    console.log("Limpando categorias. Mantendo apenas", rootCategories.length, "categorias raiz.");
    
    if (categories.length - rootCategories.length > 0) {
      toast.success(`${categories.length - rootCategories.length} categorias foram removidas com sucesso.`);
    } else {
      toast.info("Não há categorias para remover.");
    }
    
    return rootCategories;
  }
}

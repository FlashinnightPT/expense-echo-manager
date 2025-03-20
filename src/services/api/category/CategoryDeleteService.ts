
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
  public async clearNonRootCategories(categories: TransactionCategory[]): Promise<TransactionCategory[]> {
    // Filtra apenas as categorias de nível 1 (raiz)
    const rootCategories = categories.filter(cat => cat.level === 1);
    
    // Identifica as categorias a serem removidas
    const categoriesToRemove = categories.filter(cat => cat.level > 1);
    
    console.log("Limpando categorias. Mantendo apenas", rootCategories.length, "categorias raiz.");
    console.log("Categorias a remover:", categoriesToRemove.length);
    
    // Também limpa as categorias no Supabase
    if (categoriesToRemove.length > 0) {
      try {
        // Busca todas as categorias que não são de nível 1
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .gt('level', 1);
        
        if (error) {
          console.error("Erro ao buscar categorias para limpar:", error);
          toast.error("Erro ao limpar categorias no Supabase");
        } else if (data && data.length > 0) {
          console.log("Categorias encontradas no Supabase para limpeza:", data.length);
          
          // Exclui todas as categorias que não são de nível 1
          const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .gt('level', 1);
          
          if (deleteError) {
            console.error("Erro ao excluir categorias do Supabase:", deleteError);
            toast.error("Erro ao limpar categorias no Supabase");
          } else {
            console.log("Categorias removidas do Supabase:", data.length);
          }
        } else {
          console.log("Nenhuma categoria encontrada no Supabase para limpeza");
        }
      } catch (error) {
        console.error("Erro ao limpar categorias no Supabase:", error);
        toast.error("Erro ao limpar categorias no Supabase");
      }
      
      toast.success(`${categoriesToRemove.length} categorias foram removidas com sucesso.`);
    } else {
      toast.info("Não há categorias para remover.");
    }
    
    return rootCategories;
  }
}

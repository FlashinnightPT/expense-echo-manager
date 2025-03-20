
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Class specifically for category fetch operations
export class CategoryFetchService extends CategoryServiceBase {
  public async getCategories(): Promise<TransactionCategory[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error("Erro ao buscar categorias do Supabase:", error);
        toast.error("Erro ao buscar categorias do Supabase");
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar categorias do Supabase:", error);
      toast.error("Erro ao buscar categorias.");
      return [];
    }
  }
}

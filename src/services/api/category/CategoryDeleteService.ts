
import { CategoryServiceBase } from "./CategoryServiceBase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

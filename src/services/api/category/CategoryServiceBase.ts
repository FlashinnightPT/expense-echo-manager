
import { ApiServiceCore } from "../ApiServiceCore";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

// Base class for category operations containing shared functionality
export class CategoryServiceBase extends ApiServiceCore {
  protected constructor() {
    super();
    this.ensureTableExists();
  }

  // Ensure the categories table exists in Supabase
  protected async ensureTableExists(): Promise<void> {
    try {
      // This method only checks if we can access the table
      // The actual table creation should be done in the Supabase console
      const { error } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (error) {
        console.warn('Tabela de categorias pode não existir:', error.message);
      }
    } catch (error) {
      console.error('Erro ao verificar tabela de categorias:', error);
    }
  }
}


import { ApiServiceCore } from "../ApiServiceCore";
import { mariadbClient } from "../../mariadbClient";
import { toast } from "sonner";

// Base class for category operations containing shared functionality
export class CategoryServiceBase extends ApiServiceCore {
  protected constructor() {
    super();
    this.ensureTableExists();
  }

  // Ensure the categories table exists in MariaDB
  protected async ensureTableExists(): Promise<void> {
    try {
      // This method only checks if we can access the table
      const result = await mariadbClient.executeQuery('SHOW TABLES LIKE "categories"');
      
      if (Array.isArray(result) && result.length === 0) {
        console.warn('Tabela de categorias pode não existir');
      }
    } catch (error) {
      console.error('Erro ao verificar tabela de categorias:', error);
    }
  }
}

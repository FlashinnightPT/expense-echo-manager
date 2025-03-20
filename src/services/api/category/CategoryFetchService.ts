
import { TransactionCategory } from "@/utils/mockData";
import { CategoryServiceBase } from "./CategoryServiceBase";
import { mariadbClient } from "../../mariadbClient";
import { toast } from "sonner";

// Class specifically for category fetch operations
export class CategoryFetchService extends CategoryServiceBase {
  public async getCategories(): Promise<TransactionCategory[]> {
    if (this.isConnected()) {
      try {
        const data = await mariadbClient.executeQuery<TransactionCategory>(
          'SELECT * FROM categories'
        );
        
        // Update localStorage as cache
        localStorage.setItem('categories', JSON.stringify(data || []));
        
        return data || [];
      } catch (error) {
        console.error("Erro ao buscar categorias do MariaDB:", error);
        toast.error("Erro ao buscar categorias. Usando dados em cache.");
        
        // Fallback to localStorage
        const storedCategories = localStorage.getItem('categories');
        return storedCategories ? JSON.parse(storedCategories) : [];
      }
    } else {
      // Offline mode - use localStorage
      const storedCategories = localStorage.getItem('categories');
      return new Promise((resolve) => {
        setTimeout(() => {
          const categories = storedCategories ? JSON.parse(storedCategories) : [];
          resolve(categories);
        }, 300);
      });
    }
  }
}

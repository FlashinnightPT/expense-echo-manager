
import { TransactionCategory } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";

// Service specifically for category operations
export class CategoryService extends ApiServiceCore {
  private static instance: CategoryService;

  private constructor() {
    super();
  }

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  public async getCategories(): Promise<TransactionCategory[]> {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedCategories = localStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        resolve(categories);
      }, 300); // Simula um pequeno delay de rede
    });
  }

  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    // Simula uma chamada de API POST
    return new Promise((resolve) => {
      setTimeout(async () => {
        const categories = await this.getCategories();
        
        const newCategory: TransactionCategory = {
          id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: category.name || "",
          type: category.type || "expense",
          level: category.level || 1,
          parentId: category.parentId,
        };
        
        const updatedCategories = [...categories, newCategory];
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        resolve(newCategory);
      }, 500); // Simula um pequeno delay de rede
    });
  }
}

// Exporta a instância singleton
export const categoryService = CategoryService.getInstance();

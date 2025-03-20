
import { TransactionCategory } from "@/utils/mockData";
import { CategoryFetchService } from "./CategoryFetchService";
import { CategoryCreateService } from "./CategoryCreateService";
import { CategoryDeleteService } from "./CategoryDeleteService";
import { CategoryServiceBase } from "./CategoryServiceBase";

// Main CategoryService class that composes specialized services
export class CategoryService extends CategoryServiceBase {
  private static instance: CategoryService;
  private fetchService: CategoryFetchService;
  private createService: CategoryCreateService;
  private deleteService: CategoryDeleteService;

  private constructor() {
    super();
    this.fetchService = new CategoryFetchService();
    this.createService = new CategoryCreateService();
    this.deleteService = new CategoryDeleteService();
  }

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }
  
  // Delegate to specialized services
  public async getCategories(): Promise<TransactionCategory[]> {
    return this.fetchService.getCategories();
  }

  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    return this.createService.saveCategory(category);
  }
  
  public async deleteCategory(categoryId: string): Promise<boolean> {
    return this.deleteService.deleteCategory(categoryId);
  }
  
  // Add the clear categories method (now async)
  public async clearNonRootCategories(categories: TransactionCategory[]): Promise<TransactionCategory[]> {
    return this.deleteService.clearNonRootCategories(categories);
  }
}

// Export the singleton instance
export const categoryService = CategoryService.getInstance();

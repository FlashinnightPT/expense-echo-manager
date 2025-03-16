
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { ApiServiceCore } from "./api/ApiServiceCore";
import { transactionService } from "./api/TransactionService";
import { categoryService } from "./api/CategoryService";
import { backupService } from "./api/BackupService";

// This is the main API Service facade that provides a single entry point to all API-related functionality
// It maintains the exact same interface as the original apiService for backward compatibility
export class ApiService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): ApiService {
    return ApiServiceCore.getOrCreateInstance.call(ApiService);
  }

  // Transaction methods delegate to transactionService
  public async getTransactions(): Promise<Transaction[]> {
    return transactionService.getTransactions();
  }

  public async saveTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    return transactionService.saveTransaction(transaction);
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    return transactionService.deleteTransaction(transactionId);
  }

  // Category methods delegate to categoryService
  public async getCategories(): Promise<TransactionCategory[]> {
    return categoryService.getCategories();
  }

  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    return categoryService.saveCategory(category);
  }

  // Backup methods delegate to backupService
  public async exportDatabase(): Promise<boolean> {
    return backupService.exportDatabase();
  }

  public async importDatabase(file: File): Promise<boolean> {
    return backupService.importDatabase(file);
  }

  // Connection method is already implemented in the parent class
}

// Export the singleton instance to maintain the same interface
export const apiService = ApiService.getInstance();


import { Transaction } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";
import { toast } from "sonner";
import { dbToTransactionModel, transactionModelToDb } from "@/utils/supabaseAdapters";

// Mock transactions storage
const mockTransactions: Record<string, any> = {};

// Service for transaction operations
export class TransactionService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): TransactionService {
    return ApiServiceCore.getOrCreateInstance.call(TransactionService);
  }
  
  // Ensure mock table exists
  private ensureTableExists(): void {
    if (!mockTransactions['transactions']) {
      mockTransactions['transactions'] = [];
    }
  }

  public async getTransactions(): Promise<Transaction[]> {
    try {
      this.ensureTableExists();
      // Return mock transactions
      return mockTransactions['transactions'].map(dbToTransactionModel);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions");
      return [];
    }
  }

  public async saveTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: transaction.id || `transaction-${Date.now()}`,
      description: transaction.description || (transaction.type === "income" ? "Receita" : "Despesa"),
      amount: transaction.amount || 0,
      date: transaction.date || new Date().toISOString().split('T')[0],
      categoryId: transaction.categoryId || "",
      type: transaction.type || "expense"
    };
    
    try {
      this.ensureTableExists();
      // Convert to DB format
      const dbTransaction = transactionModelToDb(newTransaction);
      
      // Add to mock storage
      mockTransactions['transactions'].push(dbTransaction);
      
      // Simulate event for other components
      window.dispatchEvent(new Event('storage'));
      
      return newTransaction;
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error("Error saving transaction");
      return newTransaction;
    }
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      this.ensureTableExists();
      // Find transaction index
      const index = mockTransactions['transactions'].findIndex((t: any) => t.id === transactionId);
      
      if (index >= 0) {
        // Remove from mock storage
        mockTransactions['transactions'].splice(index, 1);
        
        // Simulate event for other components
        window.dispatchEvent(new Event('storage'));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error deleting transaction");
      return false;
    }
  }
}

// Export singleton instance
export const transactionService = TransactionService.getInstance();

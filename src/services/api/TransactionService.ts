
import { Transaction } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";
import { toast } from "sonner";
import { dbToTransactionModel, transactionModelToDb } from "@/utils/supabaseAdapters";

// Service for transaction operations
export class TransactionService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): TransactionService {
    return ApiServiceCore.getOrCreateInstance.call(TransactionService);
  }

  public async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await this.apiGet<any[]>('/transactions');
      
      if (!data) {
        console.error("Error fetching transactions from API: No data returned");
        toast.error("Error fetching transactions");
        return [];
      }
      
      // Transform database records to application model
      return data.map(dbToTransactionModel);
    } catch (error) {
      console.error("Error fetching transactions from API:", error);
      toast.error("Error fetching transactions");
      return [];
    }
  }

  public async saveTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      // Convert to DB format
      const dbTransaction = transactionModelToDb(transaction);
      
      // Send to API
      const result = await this.apiPost('/transactions', dbTransaction);
      
      if (!result) {
        throw new Error("No data returned from API");
      }
      
      const savedTransaction = dbToTransactionModel(result);
      return savedTransaction;
    } catch (error) {
      console.error("Error saving transaction to API:", error);
      toast.error("Error saving transaction");
      throw error;
    }
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      return await this.apiDelete(`/transactions/${transactionId}`);
    } catch (error) {
      console.error("Error deleting transaction from API:", error);
      toast.error("Error deleting transaction");
      return false;
    }
  }
}

// Export singleton instance
export const transactionService = TransactionService.getInstance();

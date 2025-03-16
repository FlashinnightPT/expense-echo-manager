
import { Transaction } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";

// Service specifically for transaction operations
export class TransactionService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): TransactionService {
    return ApiServiceCore.getOrCreateInstance.call(TransactionService);
  }

  public async getTransactions(): Promise<Transaction[]> {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedTransactions = localStorage.getItem('transactions');
        const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        resolve(transactions);
      }, 300); // Simula um pequeno delay de rede
    });
  }

  public async saveTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    // Simula uma chamada de API POST
    return new Promise((resolve) => {
      setTimeout(async () => {
        const transactions = await this.getTransactions();
        
        const newTransaction: Transaction = {
          id: `transaction-${Date.now()}`,
          description: transaction.description || (transaction.type === "income" ? "Receita" : "Despesa"),
          amount: transaction.amount || 0,
          date: transaction.date || new Date().toISOString().split('T')[0],
          categoryId: transaction.categoryId || "",
          type: transaction.type || "expense"
        };
        
        const updatedTransactions = [...transactions, newTransaction];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        resolve(newTransaction);
      }, 500); // Simula um pequeno delay de rede
    });
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    // Simula uma chamada de API DELETE
    return new Promise((resolve) => {
      setTimeout(async () => {
        const transactions = await this.getTransactions();
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        resolve(true);
      }, 500); // Simula um pequeno delay de rede
    });
  }
}

// Exporta a instância singleton
export const transactionService = TransactionService.getInstance();

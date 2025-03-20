
import { Transaction } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";
import { mariadbClient } from "../mariadbClient";
import { toast } from "sonner";

// Service specifically for transaction operations
export class TransactionService extends ApiServiceCore {
  private constructor() {
    super();
    this.ensureTableExists();
  }

  public static getInstance(): TransactionService {
    return ApiServiceCore.getOrCreateInstance.call(TransactionService);
  }
  
  // Garantir que a tabela existe no MariaDB
  private async ensureTableExists(): Promise<void> {
    try {
      // Este método apenas verifica se conseguimos acessar a tabela
      const result = await mariadbClient.executeQuery('SHOW TABLES LIKE "transactions"');
      
      if (Array.isArray(result) && result.length === 0) {
        console.warn('Tabela de transações pode não existir');
      }
    } catch (error) {
      console.error('Erro ao verificar tabela de transações:', error);
    }
  }

  public async getTransactions(): Promise<Transaction[]> {
    if (this.isConnected()) {
      try {
        const data = await mariadbClient.executeQuery<Transaction>('SELECT * FROM transactions');
        
        // Atualizar o localStorage como cache
        localStorage.setItem('transactions', JSON.stringify(data || []));
        
        return data || [];
      } catch (error) {
        console.error("Erro ao buscar transações do MariaDB:", error);
        toast.error("Erro ao buscar transações. Usando dados em cache.");
        
        // Fallback para localStorage
        const storedTransactions = localStorage.getItem('transactions');
        return storedTransactions ? JSON.parse(storedTransactions) : [];
      }
    } else {
      // Modo offline - usar localStorage
      const storedTransactions = localStorage.getItem('transactions');
      return new Promise((resolve) => {
        setTimeout(() => {
          const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
          resolve(transactions);
        }, 300);
      });
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
    
    if (this.isConnected()) {
      try {
        await mariadbClient.executeQuery(
          'INSERT INTO transactions (id, description, amount, date, category_id, type) VALUES (?, ?, ?, ?, ?, ?)',
          [
            newTransaction.id,
            newTransaction.description,
            newTransaction.amount,
            newTransaction.date,
            newTransaction.categoryId,
            newTransaction.type
          ]
        );
        
        // Atualizar cache local
        const transactions = await this.getTransactions();
        const updatedTransactions = [...transactions, newTransaction];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        return newTransaction;
      } catch (error) {
        console.error("Erro ao salvar transação no MariaDB:", error);
        toast.error("Erro ao salvar transação online. Salvando localmente.");
        
        // Adicionar operação à fila para sincronizar depois
        this.addPendingOperation(async () => {
          await this.saveTransaction(newTransaction);
        });
        
        // Salvar localmente como fallback
        const storedTransactions = localStorage.getItem('transactions');
        const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        const updatedTransactions = [...transactions, newTransaction];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        window.dispatchEvent(new Event('storage'));
        
        return newTransaction;
      }
    } else {
      // Modo offline - salvar no localStorage e adicionar à fila
      return new Promise((resolve) => {
        setTimeout(async () => {
          const transactions = await this.getTransactions();
          const updatedTransactions = [...transactions, newTransaction];
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
          
          // Adicionar à fila para sincronizar quando online
          this.addPendingOperation(async () => {
            await this.saveTransaction(newTransaction);
          });
          
          // Simula evento para outros componentes
          window.dispatchEvent(new Event('storage'));
          
          resolve(newTransaction);
        }, 500);
      });
    }
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    if (this.isConnected()) {
      try {
        await mariadbClient.executeQuery(
          'DELETE FROM transactions WHERE id = ?',
          [transactionId]
        );
        
        // Atualizar cache local
        const storedTransactions = localStorage.getItem('transactions');
        if (storedTransactions) {
          const transactions = JSON.parse(storedTransactions);
          const updatedTransactions = transactions.filter((t: Transaction) => t.id !== transactionId);
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        }
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        return true;
      } catch (error) {
        console.error("Erro ao excluir transação do MariaDB:", error);
        toast.error("Erro ao excluir transação online. Excluindo localmente.");
        
        // Adicionar operação à fila para sincronizar depois
        this.addPendingOperation(async () => {
          await this.deleteTransaction(transactionId);
        });
        
        // Excluir localmente como fallback
        const storedTransactions = localStorage.getItem('transactions');
        if (storedTransactions) {
          const transactions = JSON.parse(storedTransactions);
          const updatedTransactions = transactions.filter((t: Transaction) => t.id !== transactionId);
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        }
        
        window.dispatchEvent(new Event('storage'));
        
        return true;
      }
    } else {
      // Modo offline - excluir do localStorage e adicionar à fila
      return new Promise((resolve) => {
        setTimeout(() => {
          const storedTransactions = localStorage.getItem('transactions');
          if (storedTransactions) {
            const transactions = JSON.parse(storedTransactions);
            const updatedTransactions = transactions.filter((t: Transaction) => t.id !== transactionId);
            localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
          }
          
          // Adicionar à fila para sincronizar quando online
          this.addPendingOperation(async () => {
            await this.deleteTransaction(transactionId);
          });
          
          // Simula evento para outros componentes
          window.dispatchEvent(new Event('storage'));
          
          resolve(true);
        }, 500);
      });
    }
  }
}

// Exporta a instância singleton
export const transactionService = TransactionService.getInstance();

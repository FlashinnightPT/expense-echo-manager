
import { Transaction } from "@/utils/mockData";
import { ApiServiceCore } from "./ApiServiceCore";
import { supabase } from "../supabaseClient";
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
  
  // Garantir que a tabela existe no Supabase
  private async ensureTableExists(): Promise<void> {
    try {
      // Este método apenas verifica se conseguimos acessar a tabela
      // A criação real da tabela deve ser feita no console do Supabase
      const { error } = await supabase
        .from('transactions')
        .select('id')
        .limit(1);
      
      if (error) {
        console.warn('Tabela de transações pode não existir:', error.message);
      }
    } catch (error) {
      console.error('Erro ao verificar tabela de transações:', error);
    }
  }

  public async getTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*');
      
      if (error) {
        console.error("Erro ao buscar transações do Supabase:", error);
        toast.error("Erro ao buscar transações");
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar transações do Supabase:", error);
      toast.error("Erro ao buscar transações");
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
      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao salvar transação no Supabase:", error);
        toast.error("Erro ao salvar transação");
        return newTransaction;
      }
      
      // Simula evento para outros componentes
      window.dispatchEvent(new Event('storage'));
      
      return data || newTransaction;
    } catch (error) {
      console.error("Erro ao salvar transação no Supabase:", error);
      toast.error("Erro ao salvar transação");
      return newTransaction;
    }
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);
      
      if (error) {
        console.error("Erro ao excluir transação do Supabase:", error);
        toast.error("Erro ao excluir transação");
        return false;
      }
      
      // Simula evento para outros componentes
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir transação do Supabase:", error);
      toast.error("Erro ao excluir transação");
      return false;
    }
  }
}

// Exporta a instância singleton
export const transactionService = TransactionService.getInstance();

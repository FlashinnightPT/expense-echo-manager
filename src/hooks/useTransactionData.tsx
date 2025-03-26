
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Transaction } from "@/utils/mockData";
import { dbToTransactionModel, transactionModelToDb } from "@/utils/supabaseAdapters";

// Mock transaction data storage
const mockTransactions: Transaction[] = [];

export const useTransactionData = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      // Use mock data instead of Supabase
      setTransactionList([...mockTransactions]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Erro ao carregar transações");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    
    const handleStorageChange = () => {
      console.log("Storage changed, updating transaction list");
      fetchTransactions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isCategoryUsedInTransactions = (categoryId: string) => {
    return transactionList.some(transaction => transaction.categoryId === categoryId);
  };

  const confirmClearTransactions = async () => {
    try {
      if (window.confirm("Tem certeza que deseja apagar todas as transações? Esta ação não pode ser desfeita.")) {
        // Clear mock transactions
        mockTransactions.length = 0;
        
        // Update local state
        setTransactionList([]);
        toast.success("Todas as transações foram apagadas com sucesso");
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('storage'));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao limpar transações:", error);
      toast.error("Erro ao apagar transações");
      return false;
    }
  };

  const getFilteredTransactions = (year?: number, month?: number, type?: 'income' | 'expense') => {
    return transactionList.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      
      if (year && transactionYear !== year) return false;
      
      if (month && transactionMonth !== month) return false;
      
      if (type && transaction.type !== type) return false;
      
      return true;
    });
  };

  const generateTestTransactions = async (categoryList: any[]) => {
    try {
      if (!categoryList || categoryList.length === 0) {
        toast.error("Não existem categorias para gerar transações");
        return false;
      }

      const leafCategories = categoryList.filter(cat => {
        return !categoryList.some(potentialChild => potentialChild.parentId === cat.id);
      });

      if (leafCategories.length === 0) {
        toast.error("Não existem categorias folha para gerar transações");
        return false;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      
      const startDate = new Date(currentYear - 2, 0, 1);
      const endDate = new Date(currentYear, currentMonth - 1, currentDay);
      
      let transactionsCreated = 0;
      const newTransactions: Transaction[] = [];

      leafCategories.forEach(category => {
        const transactionsPerYear = Math.floor(Math.random() * 6) + 2;
        const numYears = (currentYear - startDate.getFullYear()) + 1;
        const totalTransactions = transactionsPerYear * numYears;
        
        for (let i = 0; i < totalTransactions; i++) {
          const randomDate = new Date(
            startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
          );
          
          const dateString = randomDate.toISOString().split('T')[0];
          
          const randomAmount = Math.round(Math.random() * 990 + 10);
          
          const description = category.type === 'income' 
            ? `Receita: ${category.name}` 
            : `Despesa: ${category.name}`;
          
          const newTransaction: Transaction = {
            id: `transaction-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            description,
            amount: randomAmount,
            date: dateString,
            categoryId: category.id,
            type: category.type
          };
          
          newTransactions.push(newTransaction);
          mockTransactions.push(newTransaction);
          transactionsCreated++;
        }
      });

      // Update local state
      setTransactionList(prev => [...prev, ...newTransactions]);
      
      toast.success(`${transactionsCreated} transações de teste foram criadas com sucesso`);
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error("Erro ao gerar transações de teste:", error);
      toast.error("Ocorreu um erro ao gerar transações de teste");
      return false;
    }
  };

  return {
    transactionList,
    isCategoryUsedInTransactions,
    confirmClearTransactions,
    getFilteredTransactions,
    generateTestTransactions,
    isLoading
  };
};

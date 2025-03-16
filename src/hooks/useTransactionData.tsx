
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useTransactionData = () => {
  const initTransactions = () => {
    const storedTransactions = localStorage.getItem('transactions');
    try {
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    } catch (error) {
      console.error("Error parsing transactions from localStorage:", error);
      return [];
    }
  };

  const [transactionList, setTransactionList] = useState(initTransactions());

  // Escutar por eventos de storage para atualizar dados quando importar/exportar
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage changed, updating transaction list");
      setTransactionList(initTransactions());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactionList));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }
  }, [transactionList]);

  const isCategoryUsedInTransactions = (categoryId: string) => {
    return transactionList.some(transaction => transaction.categoryId === categoryId);
  };

  const confirmClearTransactions = () => {
    if (window.confirm("Tem certeza que deseja apagar todas as transações? Esta ação não pode ser desfeita.")) {
      setTransactionList([]);
      localStorage.setItem('transactions', JSON.stringify([]));
      toast.success("Todas as transações foram apagadas com sucesso");
      return true;
    }
    return false;
  };

  // Nova função para obter transações filtradas por período
  const getFilteredTransactions = (year?: number, month?: number, type?: 'income' | 'expense') => {
    return transactionList.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      
      // Filtrar por ano se especificado
      if (year && transactionYear !== year) return false;
      
      // Filtrar por mês se especificado
      if (month && transactionMonth !== month) return false;
      
      // Filtrar por tipo se especificado
      if (type && transaction.type !== type) return false;
      
      return true;
    });
  };

  return {
    transactionList,
    isCategoryUsedInTransactions,
    confirmClearTransactions,
    getFilteredTransactions
  };
};

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Transaction } from "@/utils/mockData";

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

  const generateTestTransactions = (categoryList: any[]) => {
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
          transactionsCreated++;
        }
      });

      setTransactionList(prev => [...prev, ...newTransactions]);
      
      toast.success(`${transactionsCreated} transações de teste foram criadas com sucesso`);
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
    generateTestTransactions
  };
};

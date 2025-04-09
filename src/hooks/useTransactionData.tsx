
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Transaction } from "@/utils/mockData";
import { apiService } from "@/services/apiService";

export const useTransactionData = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      // Use API service to fetch transactions
      const transactions = await apiService.getTransactions();
      setTransactionList(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error loading transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const isCategoryUsedInTransactions = (categoryId: string) => {
    return transactionList.some(transaction => transaction.categoryId === categoryId);
  };

  const confirmClearTransactions = async () => {
    try {
      if (window.confirm("Are you sure you want to delete all transactions? This action cannot be undone.")) {
        // We would need an API endpoint for this operation
        // For now, we'll use individual delete operations
        const deletePromises = transactionList.map(transaction => 
          apiService.deleteTransaction(transaction.id)
        );
        
        await Promise.all(deletePromises);
        
        // Update local state
        setTransactionList([]);
        toast.success("All transactions deleted successfully");
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing transactions:", error);
      toast.error("Error deleting transactions");
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
        toast.error("No categories available to generate transactions");
        return false;
      }

      const leafCategories = categoryList.filter(cat => {
        return !categoryList.some(potentialChild => potentialChild.parentId === cat.id);
      });

      if (leafCategories.length === 0) {
        toast.error("No leaf categories to generate transactions");
        return false;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();
      
      const startDate = new Date(currentYear - 2, 0, 1);
      const endDate = new Date(currentYear, currentMonth - 1, currentDay);
      
      let transactionsCreated = 0;
      const transactionPromises = [];

      for (const category of leafCategories) {
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
            ? `Income: ${category.name}` 
            : `Expense: ${category.name}`;
          
          const newTransaction: Partial<Transaction> = {
            description,
            amount: randomAmount,
            date: dateString,
            categoryId: category.id,
            type: category.type
          };
          
          // Save using API service
          transactionPromises.push(apiService.saveTransaction(newTransaction));
          transactionsCreated++;
        }
      }

      // Wait for all save operations to complete
      const savedTransactions = await Promise.all(transactionPromises);
      
      // Update local state
      setTransactionList(prev => [...prev, ...savedTransactions]);
      
      toast.success(`${transactionsCreated} test transactions created successfully`);
      
      return true;
    } catch (error) {
      console.error("Error generating test transactions:", error);
      toast.error("Error generating test transactions");
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


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
    setTransactionList([]);
    localStorage.setItem('transactions', JSON.stringify([]));
    toast.success("Todas as transações foram apagadas com sucesso");
    return true;
  };

  return {
    transactionList,
    isCategoryUsedInTransactions,
    confirmClearTransactions
  };
};

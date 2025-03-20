
import { useMemo } from "react";
import { Transaction } from "@/utils/mockData";

export const useTransactionFiltering = (
  transactions: Transaction[],
  selectedYear: number,
  selectedMonth: number
) => {
  // Filter transactions by month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      
      return transactionYear === selectedYear && transactionMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  return {
    filteredTransactions
  };
};

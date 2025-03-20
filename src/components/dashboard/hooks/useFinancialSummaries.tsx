
import { useMemo } from "react";
import { Transaction } from "@/utils/mockData";

export const useFinancialSummaries = (
  transactions: Transaction[],
  filteredTransactions: Transaction[],
  selectedYear: number
) => {
  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expense;
    const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    
    return {
      income,
      expense,
      balance,
      differenceRate
    };
  }, [filteredTransactions]);

  // Calculate yearly summary
  const yearlySummary = useMemo(() => {
    const yearTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      
      return transactionYear === selectedYear;
    });
    
    const income = yearTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = yearTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expense;
    const differenceRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    
    return {
      income,
      expense,
      balance,
      differenceRate
    };
  }, [transactions, selectedYear]);

  return {
    monthlySummary,
    yearlySummary
  };
};

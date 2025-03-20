
import { useMemo } from "react";
import { Transaction, MonthlyData, YearlyData } from "@/utils/mockData";

export const useChartData = (
  transactions: Transaction[],
  selectedYear: number
) => {
  // Generate monthly chart data
  const monthlyChartData = useMemo(() => {
    const monthMap = new Map<number, { income: number; expense: number }>();
    
    for (let i = 1; i <= 12; i++) {
      monthMap.set(i, { income: 0, expense: 0 });
    }
    
    const yearTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === selectedYear;
    });
    
    yearTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const month = transactionDate.getMonth() + 1;
      const monthData = monthMap.get(month) || { income: 0, expense: 0 };
      
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else {
        monthData.expense += transaction.amount;
      }
      
      monthMap.set(month, monthData);
    });
    
    const result: MonthlyData[] = [];
    monthMap.forEach((data, month) => {
      result.push({
        year: selectedYear,
        month,
        income: data.income,
        expense: data.expense,
        categories: []
      });
    });
    
    return result;
  }, [transactions, selectedYear]);

  // Generate yearly chart data
  const yearlyChartData = useMemo(() => {
    const years = new Set<number>();
    
    if (transactions.length === 0) {
      const currentYear = new Date().getFullYear();
      years.add(currentYear);
    } else {
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        years.add(transactionDate.getFullYear());
      });
    }
    
    const sortedYears = Array.from(years).sort();
    
    const result: YearlyData[] = sortedYears.map(year => {
      const yearTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === year;
      });
      
      const income = yearTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = yearTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        year,
        income,
        expense,
        categories: []
      };
    });
    
    return result;
  }, [transactions]);

  return {
    monthlyChartData,
    yearlyChartData
  };
};


import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/utils/mockData";

export const usePeriodSelection = (transactions: Transaction[]) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  
  // Available years for selection
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    if (transactions.length === 0) {
      years.add(currentDate.getFullYear());
      return Array.from(years).sort((a, b) => b - a);
    }
    
    transactions.forEach(transaction => {
      const transactionYear = new Date(transaction.date).getFullYear();
      years.add(transactionYear);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);
  
  // Update selectedYear if it's no longer available
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);
  
  return {
    selectedYear,
    selectedMonth,
    availableYears,
    setSelectedYear,
    setSelectedMonth
  };
};

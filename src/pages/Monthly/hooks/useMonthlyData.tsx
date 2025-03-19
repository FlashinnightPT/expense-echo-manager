
import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/utils/mockData";
import { getMonthName } from "@/utils/financialCalculations";

export const useMonthlyData = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showValues, setShowValues] = useState(true);
  
  useEffect(() => {
    const loadTransactions = () => {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions([]);
      }
    };

    // Load display preference from sessionStorage
    const savedPreference = sessionStorage.getItem('showFinancialValues');
    if (savedPreference) {
      setShowValues(savedPreference === 'true');
    }

    loadTransactions();

    window.addEventListener('storage', loadTransactions);

    return () => {
      window.removeEventListener('storage', loadTransactions);
    };
  }, []);
  
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    if (transactions.length === 0) {
      years.add(currentYear);
      return Array.from(years).sort((a, b) => b - a);
    }
    
    transactions.forEach(transaction => {
      const transactionYear = new Date(transaction.date).getFullYear();
      years.add(transactionYear);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions, currentYear]);
  
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);
  
  const monthlyData = useMemo(() => {
    const monthlyDataMap = new Map<number, { income: number; expense: number }>();
    for (let i = 1; i <= 12; i++) {
      monthlyDataMap.set(i, { income: 0, expense: 0 });
    }
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1;
      
      if (year === selectedYear) {
        const monthData = monthlyDataMap.get(month) || { income: 0, expense: 0 };
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else {
          monthData.expense += transaction.amount;
        }
        monthlyDataMap.set(month, monthData);
      }
    });
    
    const result = [];
    for (let month = 1; month <= 12; month++) {
      const data = monthlyDataMap.get(month) || { income: 0, expense: 0 };
      result.push({
        year: selectedYear,
        month,
        income: data.income,
        expense: data.expense,
        categories: []
      });
    }
    
    return result;
  }, [transactions, selectedYear]);
  
  const tableData = useMemo(() => {
    return monthlyData.map(item => {
      const income = item.income;
      const expense = item.expense;
      const balance = income - expense;
      const differenceRate = income > 0 ? ((income - expense) / income * 100).toFixed(2) : "0.00";
      
      return {
        month: item.month,
        monthName: getMonthName(item.month),
        income,
        expense,
        balance,
        differenceRate
      };
    });
  }, [monthlyData]);

  return {
    selectedYear,
    setSelectedYear,
    transactions,
    showValues,
    availableYears,
    monthlyData,
    tableData,
    currentYear
  };
};

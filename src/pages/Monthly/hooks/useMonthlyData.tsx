import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { getMonthName } from "@/utils/financialCalculations";
import { toast } from "sonner";
import { apiService } from "@/services/apiService";

export const useMonthlyData = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [showValues, setShowValues] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch transactions and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use API service to fetch data
        const [transactionsData, categoriesData] = await Promise.all([
          apiService.getTransactions(),
          apiService.getCategories()
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Error fetching data: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Load display preference from sessionStorage
    const savedPreference = sessionStorage.getItem('showFinancialValues');
    if (savedPreference) {
      setShowValues(savedPreference === 'true');
    }

    // Initial fetch
    fetchData();

    // Listen for storage events to update data when it changes
    const handleStorageChange = () => {
      fetchData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  // Function to check if transaction is fixed
  const isFixedTransaction = (transaction: Transaction) => {
    const categoryId = transaction.categoryId;
    if (!categoryId) return false;
    
    // Find the category
    const category = categories.find(c => c.id === categoryId);
    if (!category) return false;
    
    // Check if category is fixed
    if (category.isFixedExpense) return true;
    
    // Check parent categories
    let parentId = category.parentId;
    while (parentId) {
      const parentCategory = categories.find(c => c.id === parentId);
      if (!parentCategory) break;
      
      if (parentCategory.isFixedExpense) return true;
      parentId = parentCategory.parentId;
    }
    
    return false;
  };
  
  const monthlyData = useMemo(() => {
    const monthlyDataMap = new Map<number, { income: number; expense: number; fixedIncome: number; fixedExpense: number }>();
    for (let i = 1; i <= 12; i++) {
      monthlyDataMap.set(i, { income: 0, expense: 0, fixedIncome: 0, fixedExpense: 0 });
    }
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const year = transactionDate.getFullYear();
      const month = transactionDate.getMonth() + 1;
      
      if (year === selectedYear) {
        const monthData = monthlyDataMap.get(month) || { income: 0, expense: 0, fixedIncome: 0, fixedExpense: 0 };
        
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
          if (isFixedTransaction(transaction)) {
            monthData.fixedIncome += transaction.amount;
          }
        } else {
          monthData.expense += transaction.amount;
          if (isFixedTransaction(transaction)) {
            monthData.fixedExpense += transaction.amount;
          }
        }
        
        monthlyDataMap.set(month, monthData);
      }
    });
    
    const result = [];
    for (let month = 1; month <= 12; month++) {
      const data = monthlyDataMap.get(month) || { income: 0, expense: 0, fixedIncome: 0, fixedExpense: 0 };
      result.push({
        year: selectedYear,
        month,
        income: data.income,
        expense: data.expense,
        fixedIncome: data.fixedIncome,
        fixedExpense: data.fixedExpense,
        categories: []
      });
    }
    
    return result;
  }, [transactions, selectedYear, categories]);
  
  const tableData = useMemo(() => {
    return monthlyData.map(item => {
      const income = item.income;
      const expense = item.expense;
      const balance = income - expense;
      const differenceRate = income > 0 ? ((income - expense) / income * 100).toFixed(2) : "0.00";
      const fixedIncome = item.fixedIncome;
      const fixedExpense = item.fixedExpense;
      
      return {
        month: item.month,
        monthName: getMonthName(item.month),
        income,
        expense,
        balance,
        differenceRate,
        fixedIncome,
        fixedExpense
      };
    });
  }, [monthlyData]);

  return {
    selectedYear,
    setSelectedYear,
    transactions,
    showValues,
    setShowValues,
    availableYears,
    monthlyData,
    tableData,
    currentYear,
    isLoading
  };
};

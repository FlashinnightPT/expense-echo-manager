
import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory, MonthlyData, YearlyData } from "@/utils/mockData";

export const useDashboardData = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  
  // Load data from localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Initialize with empty array if no data
      localStorage.setItem('transactions', JSON.stringify([]));
    }
    
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initialize with empty array if no data
      localStorage.setItem('categories', JSON.stringify([]));
      
      // You might want to add some default categories here
      // const defaultCategories = [...];
      // setCategories(defaultCategories);
      // localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
  }, []);
  
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
  
  // Filter transactions by month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      
      return transactionYear === selectedYear && transactionMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

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

  // Handle data operations
  const handleSaveCategory = (category: Partial<TransactionCategory>) => {
    const newCategory: TransactionCategory = {
      id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: category.name || "",
      type: category.type || "expense",
      level: category.level || 1,
      parentId: category.parentId,
    };

    const updatedCategories = [...categories, newCategory];
    
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    
    console.log('Category saved:', newCategory);
    return newCategory;
  };

  const handleSaveTransaction = (transaction: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: `transaction-${Date.now()}`,
      description: transaction.description || (transaction.type === "income" ? "Receita" : "Despesa"),
      amount: transaction.amount || 0,
      date: transaction.date || new Date().toISOString().split('T')[0],
      categoryId: transaction.categoryId || "",
      type: transaction.type || "expense"
    };

    const updatedTransactions = [...transactions, newTransaction];
    
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
    
    console.log('Transaction saved:', newTransaction);
    return newTransaction;
  };

  const handleClearAllData = () => {
    setTransactions([]);
    setCategories([]);
    localStorage.setItem('transactions', JSON.stringify([]));
    localStorage.setItem('categories', JSON.stringify([]));
  };

  return {
    selectedYear,
    selectedMonth,
    transactions,
    categories,
    filteredTransactions,
    availableYears,
    monthlySummary,
    yearlySummary,
    monthlyChartData,
    yearlyChartData,
    setSelectedYear,
    setSelectedMonth,
    handleSaveCategory,
    handleSaveTransaction,
    handleClearAllData,
    getCategoryById: (categoryId: string) => {
      return categories.find(cat => cat.id === categoryId);
    },
    getCategoryPath: (categoryId: string) => {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) return [];
      
      const path = [category.name];
      let currentCategory = category;
      
      while (currentCategory.parentId) {
        const parentCategory = categories.find(cat => cat.id === currentCategory.parentId);
        if (!parentCategory) break;
        
        path.unshift(parentCategory.name);
        currentCategory = parentCategory;
      }
      
      return path;
    }
  };
};

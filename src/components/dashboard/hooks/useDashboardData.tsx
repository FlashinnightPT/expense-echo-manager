import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

export const useDashboardData = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from API service
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [transactionsData, categoriesData] = await Promise.all([
          apiService.getTransactions(),
          apiService.getCategories()
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
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
    
    const result = [];
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
    
    const result = sortedYears.map(year => {
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

  // Handle data operations with API
  const handleSaveCategory = async (category: Partial<TransactionCategory>) => {
    try {
      const newCategory = await apiService.saveCategory(category);
      setCategories(prev => [...prev, newCategory]);
      toast.success(`Categoria "${category.name}" adicionada com sucesso`);
      return newCategory;
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error("Erro ao salvar categoria. Tente novamente.");
      return null;
    }
  };

  const handleSaveTransaction = async (transaction: Partial<Transaction>) => {
    try {
      const newTransaction = await apiService.saveTransaction(transaction);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      toast.error("Erro ao salvar transação. Tente novamente.");
      return null;
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await apiService.deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      return true;
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error("Erro ao excluir transação. Tente novamente.");
      return false;
    }
  };

  const handleClearAllData = () => {
    if (window.confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
      setTransactions([]);
      setCategories([]);
      toast.success("Todos os dados foram limpos com sucesso");
    }
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
    isLoading,
    setSelectedYear,
    setSelectedMonth,
    handleSaveCategory,
    handleSaveTransaction,
    handleDeleteTransaction,
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

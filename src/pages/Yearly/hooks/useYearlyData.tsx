
import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

// Mock data
const mockTransactions: Transaction[] = [];
const mockCategories: TransactionCategory[] = [];

export const useYearlyData = () => {
  const currentYear = new Date().getFullYear();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [showValues, setShowValues] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch transactions (using mock data instead of Supabase)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use mock data
        setTransactions([...mockTransactions]);
        setCategories([...mockCategories]);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    
    // Create event listener for storage changes
    const handleStorageChange = () => {
      fetchData();
    };
    
    // Add event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Extract available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    // If no transactions, return only current year
    if (transactions.length === 0) {
      years.add(currentYear);
      return Array.from(years).sort((a, b) => b - a);
    }
    
    // Extract unique years from transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      years.add(transactionDate.getFullYear());
    });
    
    // Convert Set to array and sort descending
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions, currentYear]);
  
  // Initialize selectedYears with most recent year
  useEffect(() => {
    if (availableYears.length > 0 && selectedYears.length === 0) {
      setSelectedYears([availableYears[0]]);
    }
  }, [availableYears, selectedYears]);
  
  // Function to toggle year selection
  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };
  
  // Check if transaction is fixed
  const isFixedTransaction = (transaction: Transaction) => {
    const categoryId = transaction.categoryId;
    if (!categoryId) return false;
    
    // Find category
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
  
  // Generate yearly data from transactions
  const yearlyData = useMemo(() => {
    // Get unique years
    const years = new Set<number>(availableYears);
    
    // Create yearly summary for each year
    const result = Array.from(years).map(year => {
      // Filter transactions for this year
      const yearTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === year;
      });
      
      // Calculate totals
      const income = yearTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = yearTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Calculate fixed incomes and expenses
      const fixedIncome = yearTransactions
        .filter(t => t.type === 'income' && isFixedTransaction(t))
        .reduce((sum, t) => sum + t.amount, 0);
        
      const fixedExpense = yearTransactions
        .filter(t => t.type === 'expense' && isFixedTransaction(t))
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        year,
        income,
        expense,
        fixedIncome,
        fixedExpense,
        categories: []
      };
    });
    
    return result;
  }, [transactions, availableYears, categories]);
  
  // Filter data based on selected years
  const filteredData = useMemo(() => {
    return yearlyData.filter(item => selectedYears.includes(item.year));
  }, [yearlyData, selectedYears]);
  
  // Calculate totals
  const totalIncome = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.income, 0);
  }, [filteredData]);
  
  const totalExpenses = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.expense, 0);
  }, [filteredData]);
  
  const totalFixedIncome = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.fixedIncome || 0), 0);
  }, [filteredData]);
  
  const totalFixedExpenses = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.fixedExpense || 0), 0);
  }, [filteredData]);
  
  // Prepare data for table display
  const tableData = useMemo(() => {
    return filteredData.map(item => ({
      year: item.year,
      income: item.income,
      expense: item.expense,
      balance: item.income - item.expense,
      differenceRate: item.income > 0 ? ((item.income - item.expense) / item.income * 100).toFixed(2) : "0.00",
      fixedIncome: item.fixedIncome || 0,
      fixedExpense: item.fixedExpense || 0
    }));
  }, [filteredData]);

  // Define table columns
  const columns = [
    {
      id: "year",
      header: "Ano",
      accessorFn: (row: any) => row.year,
      sortable: true,
    },
    {
      id: "income",
      header: "Receitas",
      accessorFn: (row: any) => showValues ? formatCurrency(row.income) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "expense",
      header: "Despesas",
      accessorFn: (row: any) => showValues ? formatCurrency(row.expense) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "fixedIncome",
      header: "Receitas Fixas",
      accessorFn: (row: any) => showValues ? formatCurrency(row.fixedIncome) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "fixedExpense",
      header: "Despesas Fixas",
      accessorFn: (row: any) => showValues ? formatCurrency(row.fixedExpense) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "balance",
      header: "Saldo",
      accessorFn: (row: any) => showValues ? formatCurrency(row.balance) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "differenceRate",
      header: "Diferença",
      accessorFn: (row: any) => showValues ? `${row.differenceRate}%` : "•••••••",
      sortable: true,
      className: "text-right",
    },
  ];

  return {
    availableYears,
    selectedYears,
    toggleYear,
    filteredData,
    totalIncome,
    totalExpenses,
    totalFixedIncome,
    totalFixedExpenses,
    tableData,
    columns,
    showValues,
    currentYear,
    isLoading
  };
};

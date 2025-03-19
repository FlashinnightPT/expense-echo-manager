
import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

export const useYearlyData = () => {
  const currentYear = new Date().getFullYear();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [showValues, setShowValues] = useState(true);
  
  // Load transactions from localStorage
  useEffect(() => {
    const loadTransactions = () => {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions([]);
      }
    };

    // Load the preference of displaying values from sessionStorage
    const savedPreference = sessionStorage.getItem('showFinancialValues');
    if (savedPreference) {
      setShowValues(savedPreference === 'true');
    }

    // Load initially
    loadTransactions();

    // Add event listener for storage changes
    window.addEventListener('storage', loadTransactions);

    // Cleanup
    return () => {
      window.removeEventListener('storage', loadTransactions);
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
    
    // Convert Set to array and sort descending (most recent first)
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions, currentYear]);
  
  // Initialize selectedYears with the most recent year
  useEffect(() => {
    if (availableYears.length > 0 && selectedYears.length === 0) {
      setSelectedYears([availableYears[0]]);
    }
  }, [availableYears, selectedYears]);
  
  // Function to toggle selection of a year
  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length > 1) {
        setSelectedYears(selectedYears.filter(y => y !== year));
      }
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };
  
  // Generate yearly data from transactions
  const yearlyData = useMemo(() => {
    // Get unique years from transactions or use availableYears
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
      
      return {
        year,
        income,
        expense,
        categories: []
      };
    });
    
    return result;
  }, [transactions, availableYears]);
  
  // Filter data based on selected years
  const filteredData = useMemo(() => {
    return yearlyData.filter(item => selectedYears.includes(item.year));
  }, [yearlyData, selectedYears]);
  
  // Calculate totals for selected years
  const totalIncome = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.income, 0);
  }, [filteredData]);
  
  const totalExpenses = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.expense, 0);
  }, [filteredData]);
  
  // Prepare data for table display
  const tableData = useMemo(() => {
    return filteredData.map(item => ({
      year: item.year,
      income: item.income,
      expense: item.expense,
      balance: item.income - item.expense,
      differenceRate: item.income > 0 ? ((item.income - item.expense) / item.income * 100).toFixed(2) : "0.00"
    }));
  }, [filteredData]);

  // Define table columns
  const columns = [
    {
      id: "year",
      header: "Ano",
      accessorFn: (row) => row.year,
      sortable: true,
    },
    {
      id: "income",
      header: "Receitas",
      accessorFn: (row) => showValues ? formatCurrency(row.income) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "expense",
      header: "Despesas",
      accessorFn: (row) => showValues ? formatCurrency(row.expense) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "balance",
      header: "Saldo",
      accessorFn: (row) => showValues ? formatCurrency(row.balance) : "•••••••",
      sortable: true,
      className: "text-right",
    },
    {
      id: "differenceRate",
      header: "Diferença",
      accessorFn: (row) => showValues ? `${row.differenceRate}%` : "•••••••",
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
    tableData,
    columns,
    showValues,
    currentYear
  };
};

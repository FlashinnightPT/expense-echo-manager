
import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/utils/mockData";
import { getMonthName } from "@/utils/financialCalculations";
import { supabase } from "@/integrations/supabase/client";

export const useMonthlyData = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showValues, setShowValues] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*');
          
        if (error) {
          console.error("Error fetching transactions:", error);
          return;
        }
        
        if (data) {
          // Convert database records to application model
          const formattedData = data.map(item => ({
            id: item.id,
            description: item.description,
            amount: Number(item.amount),
            date: item.date,
            categoryId: item.categoryid,
            type: item.type as 'income' | 'expense'
          }));
          
          setTransactions(formattedData);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
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
    fetchTransactions();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'transactions' 
      }, () => {
        fetchTransactions();
      })
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
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
          // We'll handle fixed income in future implementation
        } else {
          monthData.expense += transaction.amount;
          // We'll identify fixed expenses with categoryId in future version
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
  }, [transactions, selectedYear]);
  
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

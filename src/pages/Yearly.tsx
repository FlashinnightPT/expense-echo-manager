
import { useState, useEffect, useMemo } from "react";
import YearlyChart from "@/components/charts/YearlyChart";
import { Card } from "@/components/ui-custom/Card";
import { formatCurrency } from "@/utils/financialCalculations";
import DataTable from "@/components/tables/DataTable";
import { Transaction } from "@/utils/mockData";

const Yearly = () => {
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

    // Carregar a preferência de exibição de valores do sessionStorage
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Análise Anual</h1>
          <p className="text-muted-foreground mt-1">
            Compare os seus dados financeiros entre anos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableYears.map(year => (
            <button
              key={year}
              className={`px-4 py-2 rounded-md border transition-colors ${
                selectedYears.includes(year) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background hover:bg-muted'
              }`}
              onClick={() => toggleYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Receitas Totais</p>
            <p className="text-2xl font-bold mt-1">{showValues ? formatCurrency(totalIncome) : "•••••••"}</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Despesas Totais</p>
            <p className="text-2xl font-bold mt-1">{showValues ? formatCurrency(totalExpenses) : "•••••••"}</p>
          </div>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <YearlyChart data={filteredData} className="w-full" showValues={showValues} />
        </Card>
      </div>
      
      <div className="mb-8">
        <DataTable 
          data={tableData} 
          columns={columns} 
          title="Resumo Anual"
          emptyMessage="Selecione pelo menos um ano para ver os dados"
        />
      </div>
    </div>
  );
};

export default Yearly;

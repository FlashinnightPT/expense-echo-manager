
import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable from "@/components/tables/DataTable";
import MonthlyChart from "@/components/charts/MonthlyChart";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";
import { Transaction } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { FileDown, Table } from "lucide-react";
import { 
  exportToExcel, 
  prepareMonthlyDataForExport, 
  prepareMonthlyCategoryReport 
} from "@/utils/exports";
import { toast } from "sonner";
import { useCategoryData } from "@/hooks/useCategoryData";

const Monthly = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showValues, setShowValues] = useState(true);
  const { categoryList: categories } = useCategoryData();
  
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
  
  const columns = [
    {
      id: "monthName",
      header: "Mês",
      accessorFn: (row) => row.monthName,
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
  
  const handleExportData = () => {
    try {
      if (tableData.length === 0) {
        toast.error("Não há dados para exportar neste período");
        return;
      }
      
      const exportData = prepareMonthlyDataForExport(tableData, selectedYear);
      exportToExcel(exportData, `dados_mensais_${selectedYear}`);
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar dados");
    }
  };
  
  const handleExportDetailedReport = async () => {
    try {
      if (transactions.length === 0) {
        toast.error("Não há dados para exportar neste período");
        return;
      }
      
      toast.info("Preparando relatório mensal detalhado...");
      await prepareMonthlyCategoryReport(selectedYear, categories, transactions);
      toast.success("Relatório mensal exportado com sucesso");
    } catch (error) {
      console.error("Error exporting detailed report:", error);
      toast.error("Erro ao exportar relatório mensal detalhado");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Análise Mensal</h1>
          <p className="text-muted-foreground mt-1">
            Visualize seus dados financeiros mês a mês
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={handleExportData}>
            <FileDown className="h-4 w-4 mr-2" />
            Exportar Tabela
          </Button>
          <Button size="sm" onClick={handleExportDetailedReport}>
            <Table className="h-4 w-4 mr-2" />
            Relatório Mensal
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <Card>
          <MonthlyChart data={monthlyData} year={selectedYear} showValues={showValues} />
        </Card>
      </div>
      
      <div className="mb-8">
        <DataTable 
          data={tableData} 
          columns={columns} 
          title={`Dados Mensais de ${selectedYear}`}
          emptyMessage="Não há dados disponíveis para este ano"
        />
      </div>
    </div>
  );
};

export default Monthly;

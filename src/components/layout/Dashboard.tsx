import { useMemo, useState, useEffect } from "react";
import YearlyChart from "@/components/charts/YearlyChart";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import YearlyOverview from "@/components/dashboard/YearlyOverview";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/financialCalculations";
import { Transaction } from "@/utils/mockData";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { canEdit } = useAuth();
  const [showValues, setShowValues] = useState(true);
  
  useEffect(() => {
    const savedPreference = localStorage.getItem('showFinancialValues');
    if (savedPreference) {
      setShowValues(savedPreference === 'true');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('showFinancialValues', showValues.toString());
  }, [showValues]);
  
  const {
    selectedYear,
    selectedMonth,
    transactions,
    categories,
    availableYears,
    monthlySummary,
    yearlySummary,
    monthlyChartData,
    yearlyChartData,
    setSelectedYear,
    setSelectedMonth,
    handleSaveTransaction,
    handleDeleteTransaction,
    getCategoryById,
    getCategoryPath,
  } = useDashboardData();

  const toggleShowValues = () => {
    setShowValues(prev => !prev);
  };

  const handleSaveTransactionWithToast = (transaction: any) => {
    if (!canEdit) {
      toast.error("Não tem permissões para adicionar transações");
      return;
    }
    handleSaveTransaction(transaction);
    toast.success("Transação adicionada com sucesso");
  };

  const handleDeleteTransactionWithToast = (transactionId: string) => {
    if (!canEdit) {
      toast.error("Não tem permissões para excluir transações");
      return;
    }
    handleDeleteTransaction(transactionId);
    toast.success("Transação excluída com sucesso");
  };

  const transactionColumns = useMemo(() => [
    {
      id: "date",
      header: "Data",
      accessorFn: (row: Transaction) => (
        <span>{new Date(row.date).toLocaleDateString("pt-PT")}</span>
      ),
      sortable: true
    },
    {
      id: "description",
      header: "Descrição",
      accessorFn: (row: Transaction) => (
        <span className="font-medium">{row.description}</span>
      ),
      sortable: true
    },
    {
      id: "category",
      header: "Categoria",
      accessorFn: (row: Transaction) => {
        const category = getCategoryById(row.categoryId);
        if (!category) return <span>Sem Categoria</span>;
        
        const path = getCategoryPath(row.categoryId);
        return <span>{path.join(' > ')}</span>;
      },
      sortable: true
    },
    {
      id: "type",
      header: "Tipo",
      accessorFn: (row: Transaction) => {
        const badgeClasses = {
          income: "bg-finance-income/10 text-finance-income border-finance-income/20",
          expense: "bg-finance-expense/10 text-finance-expense border-finance-expense/20"
        };
        
        const typeNames = {
          income: "Receita",
          expense: "Despesa"
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeClasses[row.type]}`}>
            {typeNames[row.type]}
          </span>
        );
      },
      sortable: true
    },
    {
      id: "amount",
      header: "Valor",
      accessorFn: (row: Transaction) => (
        <span className="font-semibold tabular-nums">
          {showValues ? formatCurrency(row.amount) : "•••••••"}
        </span>
      ),
      sortable: true,
      className: "text-right"
    },
    ...(canEdit ? [{
      id: "actions",
      header: "Ações",
      accessorFn: (row: Transaction) => (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTransactionWithToast(row.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      )
    }] : [])
  ], [getCategoryById, getCategoryPath, handleDeleteTransactionWithToast, canEdit, showValues]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          onSaveTransaction={handleSaveTransactionWithToast}
          showValues={showValues}
          onToggleShowValues={toggleShowValues}
        />
        
        <SummaryCards 
          monthlySummary={monthlySummary} 
          showValues={showValues}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <MonthlyOverview 
            monthlySummary={monthlySummary}
            monthlyChartData={monthlyChartData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            availableYears={availableYears}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            showValues={showValues}
          />
          
          <YearlyOverview 
            yearlySummary={yearlySummary}
            selectedYear={selectedYear}
            showValues={showValues}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <YearlyChart data={yearlyChartData} className="lg:col-span-3 animate-fade-in-up animation-delay-700" />
        </div>
        
        <TransactionsTable 
          transactions={transactions}
          transactionColumns={transactionColumns}
        />
      </div>
    </div>
  );
};

export default Dashboard;

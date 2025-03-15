
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import YearlyChart from "@/components/charts/YearlyChart";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import MonthlyOverview from "@/components/dashboard/MonthlyOverview";
import YearlyOverview from "@/components/dashboard/YearlyOverview";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import CategoryTransactionsTable from "@/components/dashboard/CategoryTransactionsTable";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/financialCalculations";
import { Transaction } from "@/utils/mockData";

const Dashboard = () => {
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
    handleSaveCategory,
    handleSaveTransaction,
    handleClearAllData,
    getCategoryById,
    getCategoryPath,
  } = useDashboardData();

  // Define transaction columns for the DataTable
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
          {formatCurrency(row.amount)}
        </span>
      ),
      sortable: true,
      className: "text-right"
    }
  ], [getCategoryById, getCategoryPath]);

  const handleClearDataWithToast = () => {
    handleClearAllData();
    toast.success("Todos os dados foram apagados com sucesso!");
  };

  const handleSaveCategoryWithToast = (category: any) => {
    handleSaveCategory(category);
    toast.success("Categoria adicionada com sucesso");
  };

  const handleSaveTransactionWithToast = (transaction: any) => {
    handleSaveTransaction(transaction);
    toast.success("Transação adicionada com sucesso");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <DashboardHeader 
        onSaveTransaction={handleSaveTransactionWithToast}
        onSaveCategory={handleSaveCategoryWithToast}
        onClearData={handleClearDataWithToast}
        categories={categories}
      />
      
      <SummaryCards monthlySummary={monthlySummary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <MonthlyOverview 
          monthlySummary={monthlySummary}
          monthlyChartData={monthlyChartData}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          availableYears={availableYears}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
        
        <YearlyOverview 
          yearlySummary={yearlySummary}
          selectedYear={selectedYear}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <YearlyChart data={yearlyChartData} className="lg:col-span-3 animate-fade-in-up animation-delay-700" />
      </div>
      
      {/* Nova tabela hierárquica de categorias */}
      <div className="mb-8">
        <CategoryTransactionsTable 
          transactions={transactions}
          categories={categories}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          getCategoryById={getCategoryById}
        />
      </div>
      
      <TransactionsTable 
        transactions={transactions}
        transactionColumns={transactionColumns}
      />
    </div>
  );
};

export default Dashboard;

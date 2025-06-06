import { useState, useEffect } from "react";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/auth";
import { useTransactionHandlers } from "@/components/dashboard/hooks/useTransactionHandlers";
import ChartsSection from "@/components/dashboard/sections/ChartsSection";
import YearlyChartSection from "@/components/dashboard/sections/YearlyChartSection";
import TransactionsSection from "@/components/dashboard/sections/TransactionsSection";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";
import { prepareMonthlyCategoryReport } from "@/utils/exports";
import { toast } from "sonner";
import { useTransactionData } from "@/hooks/useTransactionData";

const Painel = () => {
  const { canEdit, useIdleWarning } = useAuth();
  const [showValues, setShowValues] = useState(false);
  const { IdleWarningDialog } = useIdleWarning;
  
  useEffect(() => {
    const savedPreference = sessionStorage.getItem('showFinancialValues');
    if (savedPreference) {
      setShowValues(savedPreference === 'true');
    } else {
      sessionStorage.setItem('showFinancialValues', 'false');
    }
  }, []);
  
  useEffect(() => {
    sessionStorage.setItem('showFinancialValues', showValues.toString());
  }, [showValues]);
  
  const { generateTestTransactions } = useTransactionData();
  
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
    isLoading,
    setSelectedYear,
    setSelectedMonth,
    handleSaveTransaction,
    handleDeleteTransaction,
    getCategoryById,
    getCategoryPath,
  } = useDashboardData();

  const { 
    handleSaveTransactionWithToast, 
    handleDeleteTransactionWithToast 
  } = useTransactionHandlers({
    canEdit,
    handleSaveTransaction,
    handleDeleteTransaction
  });

  const toggleShowValues = () => {
    setShowValues(prev => !prev);
  };
  
  const handleGenerateTestTransactions = () => {
    if (!canEdit) {
      toast.error("Precisa de permissões de edição para criar transações de teste");
      return;
    }
    generateTestTransactions(categories);
  };
  
  const handleGenerateDetailedMonthlyReport = async () => {
    try {
      toast.info("Gerando relatório mensal detalhado...");
      await prepareMonthlyCategoryReport(selectedYear, categories, transactions);
      toast.success("Relatório mensal detalhado gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório mensal.");
    }
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner className="h-screen" text="Estou a tratar das suas contas, p.f. aguarde!" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {!isOnline && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center">
          Você está no modo offline. Suas alterações serão sincronizadas quando a conexão for restaurada.
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          onSaveTransaction={handleSaveTransactionWithToast}
          showValues={showValues}
          onToggleShowValues={toggleShowValues}
        />
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Visão Geral</h2>
          <div className="flex gap-2">
            {canEdit && !canEdit && (
              <Button
                onClick={handleGenerateTestTransactions}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Criar Transações de Teste
              </Button>
            )}
            <Button 
              onClick={handleGenerateDetailedMonthlyReport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Relatório Mensal Detalhado
            </Button>
          </div>
        </div>
        
        <ChartsSection 
          monthlySummary={monthlySummary}
          yearlySummary={yearlySummary}
          monthlyChartData={monthlyChartData}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          availableYears={availableYears}
          showValues={showValues}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
        
        <YearlyChartSection 
          yearlyChartData={yearlyChartData}
          showValues={showValues}
        />
        
        <TransactionsSection 
          transactions={transactions}
          categories={categories}
          getCategoryById={getCategoryById}
          getCategoryPath={getCategoryPath}
          handleDeleteTransactionWithToast={handleDeleteTransactionWithToast}
          handleSaveTransactionWithToast={handleSaveTransactionWithToast}
          showValues={showValues}
          canEdit={canEdit}
        />
      </div>
      
      <IdleWarningDialog />
    </div>
  );
};

export default Painel;


import { useState, useEffect } from "react";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useTransactionHandlers } from "@/components/dashboard/hooks/useTransactionHandlers";
import ChartsSection from "@/components/dashboard/sections/ChartsSection";
import YearlyChartSection from "@/components/dashboard/sections/YearlyChartSection";
import TransactionsSection from "@/components/dashboard/sections/TransactionsSection";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { apiService } from "@/services/apiService";

const Painel = () => {
  const { canEdit, useIdleWarning } = useAuth();
  const [showValues, setShowValues] = useState(false);
  // Corrigindo a forma de acessar o componente IdleWarningDialog
  const { IdleWarningDialog } = useIdleWarning;
  
  // Preferência para mostrar/ocultar valores
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

  // Detectar status de conexão
  const [isOnline, setIsOnline] = useState(apiService.isConnected());
  
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
          getCategoryById={getCategoryById}
          getCategoryPath={getCategoryPath}
          handleDeleteTransactionWithToast={handleDeleteTransactionWithToast}
          showValues={showValues}
          canEdit={canEdit}
        />
      </div>
      
      <IdleWarningDialog />
    </div>
  );
};

export default Painel;

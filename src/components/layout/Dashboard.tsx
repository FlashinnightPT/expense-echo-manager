
import { useState, useEffect } from "react";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useTransactionHandlers } from "@/components/dashboard/hooks/useTransactionHandlers";
import ChartsSection from "@/components/dashboard/sections/ChartsSection";
import YearlyChartSection from "@/components/dashboard/sections/YearlyChartSection";
import TransactionsSection from "@/components/dashboard/sections/TransactionsSection";

const Painel = () => {
  const { canEdit } = useAuth();
  const [showValues, setShowValues] = useState(false);
  
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
    </div>
  );
};

export default Painel;


import React from "react";
import { useYearlyData } from "./hooks/useYearlyData";
import YearlyHeader from "./components/YearlyHeader";
import YearlyChartTable from "./components/YearlyChartTable";
import FixedExpensesYearlyChart from "./components/FixedExpensesYearlyChart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Yearly = () => {
  const {
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
    isLoading
  } = useYearlyData();
  
  if (isLoading) {
    return <LoadingSpinner size="xl" text="Carregando dados anuais..." className="min-h-screen flex flex-col items-center justify-center" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <YearlyHeader 
        availableYears={availableYears}
        selectedYears={selectedYears}
        toggleYear={toggleYear}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        totalFixedIncome={totalFixedIncome}
        totalFixedExpenses={totalFixedExpenses}
        showValues={showValues}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <YearlyChartTable
          filteredData={filteredData}
          tableData={tableData}
          columns={columns}
          showValues={showValues}
        />
        
        <FixedExpensesYearlyChart
          filteredData={filteredData}
          showValues={showValues}
        />
      </div>
    </div>
  );
};

export default Yearly;

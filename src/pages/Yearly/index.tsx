
import React from "react";
import { useYearlyData } from "./hooks/useYearlyData";
import YearlyHeader from "./components/YearlyHeader";
import YearlyChartTable from "./components/YearlyChartTable";

const Yearly = () => {
  const {
    availableYears,
    selectedYears,
    toggleYear,
    filteredData,
    totalIncome,
    totalExpenses,
    tableData,
    columns,
    showValues
  } = useYearlyData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <YearlyHeader 
        availableYears={availableYears}
        selectedYears={selectedYears}
        toggleYear={toggleYear}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        showValues={showValues}
      />
      
      <YearlyChartTable
        filteredData={filteredData}
        tableData={tableData}
        columns={columns}
        showValues={showValues}
      />
    </div>
  );
};

export default Yearly;

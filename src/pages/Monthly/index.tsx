
import { Card } from "@/components/ui-custom/Card";
import MonthlyChart from "@/components/charts/MonthlyChart";
import { useMonthlyData } from "./hooks/useMonthlyData";
import MonthlyHeader from "./components/MonthlyHeader";
import MonthlyTable from "./components/MonthlyTable";
import { useCategoryData } from "@/hooks/useCategoryData";
import FixedExpensesChart from "./components/FixedExpensesChart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Monthly = () => {
  const { 
    selectedYear, 
    setSelectedYear, 
    transactions, 
    showValues, 
    availableYears, 
    monthlyData, 
    tableData,
    isLoading
  } = useMonthlyData();
  
  const { categoryList: categories } = useCategoryData();
  
  if (isLoading) {
    return <LoadingSpinner size="xl" text="Carregando dados mensais..." className="min-h-screen flex flex-col items-center justify-center" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MonthlyHeader 
        selectedYear={selectedYear}
        availableYears={availableYears}
        onYearChange={setSelectedYear}
        tableData={tableData}
        transactions={transactions}
        categories={categories}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <MonthlyChart data={monthlyData} year={selectedYear} showValues={showValues} />
        </Card>
        
        <Card>
          <FixedExpensesChart data={monthlyData} year={selectedYear} showValues={showValues} />
        </Card>
      </div>
      
      <MonthlyTable 
        tableData={tableData}
        showValues={showValues}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default Monthly;

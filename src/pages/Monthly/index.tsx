
import { Card } from "@/components/ui-custom/Card";
import MonthlyChart from "@/components/charts/MonthlyChart";
import { useMonthlyData } from "./hooks/useMonthlyData";
import MonthlyHeader from "./components/MonthlyHeader";
import MonthlyTable from "./components/MonthlyTable";
import { useCategoryData } from "@/hooks/useCategoryData";

const Monthly = () => {
  const { 
    selectedYear, 
    setSelectedYear, 
    transactions, 
    showValues, 
    availableYears, 
    monthlyData, 
    tableData 
  } = useMonthlyData();
  
  const { categoryList: categories } = useCategoryData();
  
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
      
      <div className="mb-8">
        <Card>
          <MonthlyChart data={monthlyData} year={selectedYear} showValues={showValues} />
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

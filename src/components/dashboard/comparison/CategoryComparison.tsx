
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import ComparisonBarChart from "./components/ComparisonBarChart";
import ComparisonPieChart from "./components/ComparisonPieChart";
import ComparisonTable from "./components/ComparisonTable";
import EmptyComparison from "./components/EmptyComparison";
import { useComparisonData } from "./hooks/useComparisonData";

interface CategoryComparisonProps {
  categories: any[];
  transactions: any[];
  startDate: Date;
  endDate: Date;
  activeTab: "expense" | "income";
}

const CategoryComparison = ({
  categories,
  transactions,
  startDate,
  endDate,
  activeTab,
}: CategoryComparisonProps) => {
  const {
    comparisonData,
    totalAmount,
    chartData,
    removeCategoryFromComparison,
    handleExportComparison
  } = useComparisonData(categories, transactions, startDate, endDate, activeTab);

  return (
    <div id="category-comparison-section">
      <Card className="mt-8">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Comparação de Categorias (Máximo 5)
            </CardTitle>
            {comparisonData.length > 0 && (
              <Button size="sm" onClick={handleExportComparison}>
                <FileDown className="h-4 w-4 mr-2" />
                Exportar Comparação
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {comparisonData.length === 0 ? (
            <EmptyComparison />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ComparisonBarChart chartData={chartData} />
                <ComparisonPieChart 
                  chartData={chartData} 
                  totalAmount={totalAmount} 
                />
              </div>

              <ComparisonTable 
                comparisonData={comparisonData}
                totalAmount={totalAmount}
                onRemoveCategory={removeCategoryFromComparison}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryComparison;

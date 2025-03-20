
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import ComparisonTable from "./components/ComparisonTable";
import EmptyComparison from "./components/EmptyComparison";
import { useComparisonData } from "./hooks/useComparisonData";
import ComparisonBarChart from "./components/ComparisonBarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryComparisonProps {
  categories: any[];
  transactions: any[];
  startDate: Date;
  endDate: Date;
  activeTab: "expense" | "income";
  showValues: boolean;
}

const CategoryComparison = ({
  categories,
  transactions,
  startDate,
  endDate,
  activeTab,
  showValues
}: CategoryComparisonProps) => {
  const {
    comparisonData,
    totalAmount,
    removeCategoryFromComparison,
    handleExportComparison
  } = useComparisonData(categories, transactions, startDate, endDate, activeTab);

  return (
    <div id="category-comparison-section">
      <Card className="mt-8">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Comparação de Categorias ({comparisonData.length}/5)
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
            <Tabs defaultValue="table">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="table">Tabela</TabsTrigger>
                <TabsTrigger value="chart">Gráfico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <ComparisonTable 
                  comparisonData={comparisonData}
                  totalAmount={totalAmount}
                  onRemoveCategory={removeCategoryFromComparison}
                  showValues={showValues}
                />
              </TabsContent>
              
              <TabsContent value="chart">
                <ComparisonBarChart 
                  chartData={comparisonData.map((item, index) => ({
                    category: item.path.split(" (")[0],
                    amount: item.amount,
                    categoryId: item.id,
                    fill: `hsl(${index * 60}, 70%, 60%)`,
                    percentage: (item.amount / totalAmount) * 100
                  }))}
                  showValues={showValues}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryComparison;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { exportComparisonData } from "@/components/dashboard/comparison/utils/comparisonDataUtils";
import ComparisonTable from "./ComparisonTable";
import ComparisonChart from "./ComparisonChart";
import { ComparisonItem } from "@/components/dashboard/comparison/utils/comparisonDataUtils";

interface ComparisonVisualizationProps {
  comparisonItems: ComparisonItem[];
  onRemoveItem: (itemId: string) => void;
  visualizationMode: "absolute" | "percentage";
  showValues: boolean;
}

const ComparisonVisualization: React.FC<ComparisonVisualizationProps> = ({
  comparisonItems,
  onRemoveItem,
  visualizationMode,
  showValues
}) => {
  const totalAmount = comparisonItems.reduce((sum, item) => sum + item.amount, 0);
  
  // Export comparison data
  const handleExport = () => {
    // Get the earliest start date and latest end date from all items
    const startDate = comparisonItems.reduce(
      (earliest, item) => item.dateRange && item.dateRange.start < earliest ? item.dateRange.start : earliest,
      new Date()
    );
    
    const endDate = comparisonItems.reduce(
      (latest, item) => item.dateRange && item.dateRange.end > latest ? item.dateRange.end : latest,
      new Date(1970, 0, 1)
    );
    
    exportComparisonData(comparisonItems, startDate, endDate);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Comparação de Categorias ({comparisonItems.length}/5)
        </CardTitle>
        <Button size="sm" onClick={handleExport}>
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Dados
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="chart">Gráfico</TabsTrigger>
            <TabsTrigger value="table">Tabela</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <ComparisonChart 
              comparisonItems={comparisonItems}
              visualizationMode={visualizationMode}
              showValues={showValues}
            />
          </TabsContent>
          
          <TabsContent value="table">
            <ComparisonTable 
              comparisonItems={comparisonItems}
              totalAmount={totalAmount}
              onRemoveItem={onRemoveItem}
              showValues={showValues}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComparisonVisualization;

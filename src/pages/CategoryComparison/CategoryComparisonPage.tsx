
import React, { useState, useEffect } from "react";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useTransactionData } from "@/hooks/useTransactionData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComparisonVisualization from "./components/ComparisonVisualization";
import CategorySelectionPanel from "./components/CategorySelectionPanel";
import DateRangeSelector from "./components/DateRangeSelector";
import { ComparisonItem } from "@/components/dashboard/comparison/utils/comparisonDataUtils";
import { AlertTriangle } from "lucide-react";

const CategoryComparisonPage = () => {
  const { categoryList: categories } = useCategoryData();
  const { transactionList: transactions } = useTransactionData();

  // State for comparison data
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
  
  // State for visualization mode
  const [visualizationMode, setVisualizationMode] = useState<"absolute" | "percentage">("absolute");
  
  // State for values visibility
  const [showValues, setShowValues] = useState<boolean>(true);
  
  // Add an item to comparison (if not already 5 items)
  const addComparisonItem = (item: ComparisonItem) => {
    if (comparisonItems.length >= 5) {
      return false;
    }
    
    // Check if this category with same date range already exists
    const exists = comparisonItems.some(existing => 
      existing.id.split('-')[0] === item.id.split('-')[0] && 
      existing.dateRange?.start.getTime() === item.dateRange?.start.getTime() &&
      existing.dateRange?.end.getTime() === item.dateRange?.end.getTime()
    );
    
    if (!exists) {
      setComparisonItems(prev => [...prev, item]);
      return true;
    }
    
    return false;
  };
  
  // Remove an item from comparison
  const removeComparisonItem = (itemId: string) => {
    setComparisonItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  // Clear all comparison items
  const clearComparisonItems = () => {
    setComparisonItems([]);
  };
  
  // Toggle values visibility
  const toggleShowValues = () => {
    setShowValues(prev => !prev);
  };

  return (
    <main className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Comparação Avançada de Categorias</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Configurações</h3>
            
            <div className="space-y-4">
              <DateRangeSelector />
              
              <div className="flex flex-col space-y-2">
                <h4 className="text-sm font-medium">Visualização</h4>
                <Tabs defaultValue={visualizationMode} onValueChange={(v) => setVisualizationMode(v as "absolute" | "percentage")}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="absolute">Valores Absolutos</TabsTrigger>
                    <TabsTrigger value="percentage">Percentagem</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleShowValues}
                >
                  {showValues ? "Ocultar Valores" : "Mostrar Valores"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearComparisonItems}
                  disabled={comparisonItems.length === 0}
                >
                  Limpar Comparação
                </Button>
              </div>
            </div>
          </div>
          
          <CategorySelectionPanel 
            categories={categories}
            transactions={transactions}
            onAddComparisonItem={addComparisonItem}
          />
        </div>
        
        <div className="lg:col-span-2">
          {comparisonItems.length === 0 ? (
            <div className="bg-card rounded-lg border shadow-sm p-6 h-96 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma categoria selecionada</h3>
              <p className="text-muted-foreground max-w-md">
                Selecione até 5 categorias no painel à esquerda para visualizar a comparação entre elas.
              </p>
            </div>
          ) : (
            <ComparisonVisualization 
              comparisonItems={comparisonItems}
              onRemoveItem={removeComparisonItem}
              visualizationMode={visualizationMode}
              showValues={showValues}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default CategoryComparisonPage;

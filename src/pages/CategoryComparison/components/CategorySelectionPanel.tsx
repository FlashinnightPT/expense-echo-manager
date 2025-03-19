
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CategoryTree from "./CategoryTree";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventBus } from "../hooks/useEventBus";
import { ComparisonItem, createComparisonItem, calculateCategoryAmount } from "@/components/dashboard/comparison/utils/comparisonDataUtils";

interface CategorySelectionPanelProps {
  categories: any[];
  transactions: any[];
  onAddComparisonItem: (item: ComparisonItem) => boolean;
}

const CategorySelectionPanel: React.FC<CategorySelectionPanelProps> = ({ 
  categories, 
  transactions,
  onAddComparisonItem
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [dateRange, setDateRange] = useState<{ startDate: Date, endDate: Date }>({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31)
  });
  
  // Subscribe to date range changes
  const { subscribe } = useEventBus();
  
  useEffect(() => {
    const unsubscribe = subscribe("dateRangeChanged", (data) => {
      setDateRange({
        startDate: data.startDate,
        endDate: data.endDate
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Filter expense categories
  const expenseCategories = categories.filter(cat => 
    cat.type === "expense" && cat.level <= 2 && 
    (!searchTerm || cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter income categories
  const incomeCategories = categories.filter(cat => 
    cat.type === "income" && cat.level <= 2 && 
    (!searchTerm || cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle category selection for comparison
  const handleCategorySelect = (categoryId: string, categoryPath: string) => {
    // Calculate amount for this category in the selected date range
    const amount = calculateCategoryAmount(
      categoryId, 
      transactions, 
      categories, 
      dateRange.startDate, 
      dateRange.endDate
    );
    
    // Create comparison item
    const comparisonItem = createComparisonItem(
      categoryId,
      categoryPath,
      amount,
      dateRange.startDate,
      dateRange.endDate,
      true // Use custom period
    );
    
    // Add to comparison
    return onAddComparisonItem(comparisonItem);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Selecionar Categorias</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={(value) => setActiveTab(value as "expense" | "income")}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="expense">Despesas</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="p-2 max-h-96 overflow-y-auto">
            <CategoryTree 
              categories={expenseCategories} 
              allCategories={categories}
              transactions={transactions}
              dateRange={dateRange}
              onSelectCategory={handleCategorySelect}
            />
          </TabsContent>
          <TabsContent value="income" className="p-2 max-h-96 overflow-y-auto">
            <CategoryTree 
              categories={incomeCategories} 
              allCategories={categories}
              transactions={transactions}
              dateRange={dateRange}
              onSelectCategory={handleCategorySelect}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CategorySelectionPanel;

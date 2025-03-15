import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMonthName } from "@/utils/financialCalculations";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { 
  CategoryTransactionsTableProps,
  RootCategoryItem 
} from "./types/categoryTypes";
import { 
  calculateCategoryTotal,
  calculateCategoryTransactionAmount,
  getSubcategories
} from "./utils/categoryTableUtils";
import CategoryTabContent from "./components/CategoryTabContent";
import { exportToExcel, prepareCategoryDataForExport } from "@/utils/exportUtils";
import { toast } from "sonner";

const CategoryTransactionsTable = ({
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  onMonthChange,
  getCategoryById,
}: CategoryTransactionsTableProps) => {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [currentGroupedCategories, setCurrentGroupedCategories] = useState<RootCategoryItem[]>([]);
  const [currentTotalAmount, setCurrentTotalAmount] = useState<number>(0);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      return transactionYear === selectedYear && transactionMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  useEffect(() => {
    const rootCategories = categories.filter(
      (cat) => cat.level === 1 && cat.type === activeTab
    );

    const result: RootCategoryItem[] = [];

    rootCategories.forEach((rootCat) => {
      const rootAmount = calculateCategoryTotal(rootCat.id, filteredTransactions, categories);
      
      if (rootAmount === 0) return;

      const level2Subcategories = getSubcategories(rootCat.id, categories);
      const level2Items = [];

      for (const level2Cat of level2Subcategories) {
        const level2Amount = calculateCategoryTotal(level2Cat.id, filteredTransactions, categories);
        
        if (level2Amount === 0) continue;

        const level3Subcategories = getSubcategories(level2Cat.id, categories);
        const level3Items = [];

        for (const level3Cat of level3Subcategories) {
          const level3Amount = calculateCategoryTotal(level3Cat.id, filteredTransactions, categories);
          
          if (level3Amount === 0) continue;

          const level4Subcategories = getSubcategories(level3Cat.id, categories);
          const level4Items = [];

          for (const level4Cat of level4Subcategories) {
            const level4Amount = calculateCategoryTransactionAmount(level4Cat.id, filteredTransactions);
            
            if (level4Amount === 0) continue;

            level4Items.push({
              category: level4Cat,
              amount: level4Amount,
              subcategories: []
            });
          }

          level3Items.push({
            category: level3Cat,
            subcategories: level4Items,
            amount: level3Amount,
          });
        }

        level2Items.push({
          category: level2Cat,
          subcategories: level3Items,
          amount: level2Amount,
        });
      }

      result.push({
        category: rootCat,
        subcategories: level2Items,
        amount: rootAmount,
      });
    });

    setCurrentGroupedCategories(result);
    
    const total = filteredTransactions
      .filter((transaction) => transaction.type === activeTab)
      .reduce((total, transaction) => total + transaction.amount, 0);
      
    setCurrentTotalAmount(total);
    
    console.log(`Categorias agrupadas (${activeTab}):`, result.length);
    console.log(`Total (${activeTab}):`, total);
  }, [categories, activeTab, filteredTransactions]);
  
  const handleExportData = () => {
    try {
      const monthName = getMonthName(selectedMonth);
      const dateRange = `${monthName}/${selectedYear}`;
      
      const tabTransactions = filteredTransactions.filter(t => t.type === activeTab);
      
      if (tabTransactions.length === 0) {
        toast.error("Não há dados para exportar neste período");
        return;
      }
      
      const exportData = prepareCategoryDataForExport(
        tabTransactions, 
        activeTab === "expense" ? "Despesas" : "Receitas",
        dateRange
      );
      
      exportToExcel(
        exportData, 
        `${activeTab === "expense" ? "despesas" : "receitas"}_${monthName}_${selectedYear}`
      );
      
      toast.success("Dados exportados com sucesso");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erro ao exportar dados");
    }
  };

  return (
    <div className="animate-fade-in-up animation-delay-900">
      <Tabs defaultValue="expense" onValueChange={(value) => setActiveTab(value as "expense" | "income")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="expense">Despesas por Categoria</TabsTrigger>
            <TabsTrigger value="income">Receitas por Categoria</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => onMonthChange(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleExportData}>
              <FileDown className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        <CategoryTabContent 
          value="expense" 
          groupedCategories={activeTab === "expense" ? currentGroupedCategories : []}
          totalAmount={activeTab === "expense" ? currentTotalAmount : 0}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
        
        <CategoryTabContent 
          value="income" 
          groupedCategories={activeTab === "income" ? currentGroupedCategories : []}
          totalAmount={activeTab === "income" ? currentTotalAmount : 0}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </Tabs>
    </div>
  );
};

export default CategoryTransactionsTable;

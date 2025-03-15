
import { useState, useMemo } from "react";
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
import React from "react";

const CategoryTransactionsTable = ({
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  onMonthChange,
  getCategoryById,
}: CategoryTransactionsTableProps) => {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  // Filter transactions by selected year and month
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      return transactionYear === selectedYear && transactionMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  // Group categories by hierarchy for the active tab type
  const groupedCategories = useMemo(() => {
    // Filter root categories of the selected type
    const rootCategories = categories.filter(
      (cat) => cat.level === 1 && cat.type === activeTab
    );

    // Structure to store categories and subcategories
    const result: RootCategoryItem[] = [];

    // Build hierarchical structure for each root category
    rootCategories.forEach((rootCat) => {
      const rootAmount = calculateCategoryTotal(rootCat.id, filteredTransactions, categories);
      
      // Skip if no transactions for this root category
      if (rootAmount === 0) return;

      const level2Subcategories = getSubcategories(rootCat.id, categories);
      const level2Items = [];

      // For each level 2 subcategory
      level2Subcategories.forEach((level2Cat) => {
        const level2Amount = calculateCategoryTotal(level2Cat.id, filteredTransactions, categories);
        
        // Skip if no transactions for this subcategory
        if (level2Amount === 0) return;

        const level3Subcategories = getSubcategories(level2Cat.id, categories);
        const level3Items = [];

        // For each level 3 subcategory
        level3Subcategories.forEach((level3Cat) => {
          const level3Amount = calculateCategoryTotal(level3Cat.id, filteredTransactions, categories);
          
          // Skip if no transactions for this subcategory
          if (level3Amount === 0) return;

          const level4Subcategories = getSubcategories(level3Cat.id, categories);
          const level4Items = [];

          // For each level 4 subcategory
          level4Subcategories.forEach((level4Cat) => {
            const level4Amount = calculateCategoryTransactionAmount(level4Cat.id, filteredTransactions);
            
            // Skip if no transactions for this subcategory
            if (level4Amount === 0) return;

            level4Items.push({
              category: level4Cat,
              amount: level4Amount,
            });
          });

          level3Items.push({
            category: level3Cat,
            subcategories: level4Items,
            amount: level3Amount,
          });
        });

        level2Items.push({
          category: level2Cat,
          subcategories: level3Items,
          amount: level2Amount,
        });
      });

      result.push({
        category: rootCat,
        subcategories: level2Items,
        amount: rootAmount,
      });
    });

    return result;
  }, [categories, activeTab, filteredTransactions]);

  // Calculate the total amount for all transactions of the active type
  const totalAmount = useMemo(() => {
    return filteredTransactions
      .filter((transaction) => transaction.type === activeTab)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [filteredTransactions, activeTab]);

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
            <Button size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        <CategoryTabContent 
          value="expense" 
          groupedCategories={groupedCategories}
          totalAmount={totalAmount}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
        
        <CategoryTabContent 
          value="income" 
          groupedCategories={groupedCategories}
          totalAmount={totalAmount}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </Tabs>
    </div>
  );
};

export default CategoryTransactionsTable;

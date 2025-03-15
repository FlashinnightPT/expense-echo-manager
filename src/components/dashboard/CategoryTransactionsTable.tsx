
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

const CategoryTransactionsTable = ({
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  onMonthChange,
  getCategoryById,
}: CategoryTransactionsTableProps) => {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  // Filtrar transações pelo ano e mês selecionados
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;

      return transactionYear === selectedYear && transactionMonth === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  // Agrupar categorias por hierarquia
  const groupedCategories = useMemo(() => {
    // Filtrar categorias raiz do tipo selecionado
    const rootCategories = categories.filter(
      (cat) => cat.level === 1 && cat.type === activeTab
    );

    // Estrutura para armazenar categorias e subcategorias
    const result: RootCategoryItem[] = [];

    // Construir a estrutura hierárquica para cada categoria raiz
    rootCategories.forEach((rootCat) => {
      const rootAmount = calculateCategoryTotal(rootCat.id, filteredTransactions, categories);
      
      // Se não há transações para esta categoria raiz, pule
      if (rootAmount === 0) return;

      const level2Subcategories = getSubcategories(rootCat.id, categories);
      const level2Items = [];

      // Para cada subcategoria de nível 2
      level2Subcategories.forEach((level2Cat) => {
        const level2Amount = calculateCategoryTotal(level2Cat.id, filteredTransactions, categories);
        
        // Se não há transações para esta subcategoria, pule
        if (level2Amount === 0) return;

        const level3Subcategories = getSubcategories(level2Cat.id, categories);
        const level3Items = [];

        // Para cada subcategoria de nível 3
        level3Subcategories.forEach((level3Cat) => {
          const level3Amount = calculateCategoryTotal(level3Cat.id, filteredTransactions, categories);
          
          // Se não há transações para esta subcategoria, pule
          if (level3Amount === 0) return;

          const level4Subcategories = getSubcategories(level3Cat.id, categories);
          const level4Items = [];

          // Para cada subcategoria de nível 4
          level4Subcategories.forEach((level4Cat) => {
            const level4Amount = calculateCategoryTransactionAmount(level4Cat.id, filteredTransactions);
            
            // Se não há transações para esta subcategoria, pule
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

  // Calcular o valor total de todas as transações do tipo ativo
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

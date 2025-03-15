
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, getMonthName } from "@/utils/financialCalculations";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface CategoryTransactionsTableProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
  selectedYear: number;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
  getCategoryById: (id: string) => TransactionCategory | undefined;
}

// Define interfaces for our hierarchical data structure
interface Level4Item {
  category: TransactionCategory;
  amount: number;
}

interface Level3Item {
  category: TransactionCategory;
  subcategories: Level4Item[];
  amount: number;
}

interface Level2Item {
  category: TransactionCategory;
  subcategories: Level3Item[];
  amount: number;
}

interface RootCategoryItem {
  category: TransactionCategory;
  subcategories: Level2Item[];
  amount: number;
}

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
    // Função para obter todas as subcategorias 
    const getSubcategories = (parentId: string) => {
      return categories.filter((cat) => cat.parentId === parentId);
    };

    // Filtrar categorias raiz do tipo selecionado
    const rootCategories = categories.filter(
      (cat) => cat.level === 1 && cat.type === activeTab
    );

    // Estrutura para armazenar categorias e subcategorias
    const result: RootCategoryItem[] = [];

    // Construir a estrutura hierárquica para cada categoria raiz
    rootCategories.forEach((rootCat) => {
      const rootAmount = calculateCategoryTotal(rootCat.id);
      
      // Se não há transações para esta categoria raiz, pule
      if (rootAmount === 0) return;

      const level2Subcategories = getSubcategories(rootCat.id);
      const level2Items: Level2Item[] = [];

      // Para cada subcategoria de nível 2
      level2Subcategories.forEach((level2Cat) => {
        const level2Amount = calculateCategoryTotal(level2Cat.id);
        
        // Se não há transações para esta subcategoria, pule
        if (level2Amount === 0) return;

        const level3Subcategories = getSubcategories(level2Cat.id);
        const level3Items: Level3Item[] = [];

        // Para cada subcategoria de nível 3
        level3Subcategories.forEach((level3Cat) => {
          const level3Amount = calculateCategoryTotal(level3Cat.id);
          
          // Se não há transações para esta subcategoria, pule
          if (level3Amount === 0) return;

          const level4Subcategories = getSubcategories(level3Cat.id);
          const level4Items: Level4Item[] = [];

          // Para cada subcategoria de nível 4
          level4Subcategories.forEach((level4Cat) => {
            const level4Amount = calculateCategoryTransactionAmount(level4Cat.id);
            
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

  // Calcular o valor total das transações para uma categoria específica (incluindo subcategorias)
  function calculateCategoryTotal(categoryId: string): number {
    // Obter todas as subcategorias recursivamente
    const getAllSubcategoryIds = (id: string): string[] => {
      const directSubcats = categories.filter((cat) => cat.parentId === id);
      let allSubcatIds: string[] = directSubcats.map((cat) => cat.id);
      
      directSubcats.forEach((subcat) => {
        allSubcatIds = [...allSubcatIds, ...getAllSubcategoryIds(subcat.id)];
      });
      
      return allSubcatIds;
    };

    // Obter todos os IDs de subcategorias, incluindo o ID da categoria atual
    const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId)];

    // Calcular a soma de todas as transações pertencentes a essas categorias
    return filteredTransactions
      .filter((transaction) => allCategoryIds.includes(transaction.categoryId))
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Calcular o valor total apenas das transações atribuídas diretamente a esta categoria (sem subcategorias)
  function calculateCategoryTransactionAmount(categoryId: string): number {
    return filteredTransactions
      .filter((transaction) => transaction.categoryId === categoryId)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Calcular o valor total de todas as transações do tipo ativo
  const totalAmount = useMemo(() => {
    return filteredTransactions
      .filter((transaction) => transaction.type === activeTab)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [filteredTransactions, activeTab]);

  // Renderizar linha da tabela com recuo baseado no nível da categoria
  const renderCategoryRow = (
    category: TransactionCategory,
    amount: number,
    level: number
  ) => {
    const indentClass = `pl-${level * 4}`;

    return (
      <TableRow key={category.id}>
        <TableCell className={indentClass}>
          <span className="font-medium">{category.name}</span>
        </TableCell>
        <TableCell className="text-right tabular-nums">
          {formatCurrency(amount)}
        </TableCell>
      </TableRow>
    );
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
            <Button size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
        
        <TabsContent value="expense" className="m-0">
          <Card className="animate-fade-in-up animation-delay-1000 glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Despesas por Categoria ({getMonthName(selectedMonth)} {selectedYear})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                        Não há despesas registradas para este mês
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {groupedCategories.map((rootCat) => (
                        <>
                          {renderCategoryRow(rootCat.category, rootCat.amount, 0)}
                          
                          {rootCat.subcategories.map((level2Cat) => (
                            <>
                              {renderCategoryRow(level2Cat.category, level2Cat.amount, 1)}
                              
                              {level2Cat.subcategories.map((level3Cat) => (
                                <>
                                  {renderCategoryRow(level3Cat.category, level3Cat.amount, 2)}
                                  
                                  {level3Cat.subcategories.map((level4Item) => (
                                    renderCategoryRow(level4Item.category, level4Item.amount, 3)
                                  ))}
                                </>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
                      
                      <TableRow className="font-bold">
                        <TableCell>TOTAL</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(totalAmount)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="income" className="m-0">
          <Card className="animate-fade-in-up animation-delay-1000 glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Receitas por Categoria ({getMonthName(selectedMonth)} {selectedYear})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                        Não há receitas registradas para este mês
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {groupedCategories.map((rootCat) => (
                        <>
                          {renderCategoryRow(rootCat.category, rootCat.amount, 0)}
                          
                          {rootCat.subcategories.map((level2Cat) => (
                            <>
                              {renderCategoryRow(level2Cat.category, level2Cat.amount, 1)}
                              
                              {level2Cat.subcategories.map((level3Cat) => (
                                <>
                                  {renderCategoryRow(level3Cat.category, level3Cat.amount, 2)}
                                  
                                  {level3Cat.subcategories.map((level4Item) => (
                                    renderCategoryRow(level4Item.category, level4Item.amount, 3)
                                  ))}
                                </>
                              ))}
                            </>
                          ))}
                        </>
                      ))}
                      
                      <TableRow className="font-bold">
                        <TableCell>TOTAL</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(totalAmount)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryTransactionsTable;

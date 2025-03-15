
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Trash2, FileDown } from "lucide-react";
import { RootCategoryItem } from "./types/categoryTypes";
import { formatCurrency } from "@/utils/financialCalculations";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { exportToExcel } from "@/utils/exportUtils";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  // Define getRandomColor function BEFORE it's used in useMemo
  const getRandomColor = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const baseColors = activeTab === "expense" 
      ? ['#ef4444', '#f87171', '#fca5a5', '#fee2e2', '#fecaca'] 
      : ['#22c55e', '#4ade80', '#86efac', '#dcfce7', '#bbf7d0'];
    
    return baseColors[Math.abs(hash) % baseColors.length];
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= startDate &&
        transactionDate <= endDate &&
        t.type === activeTab
      );
    });
  }, [transactions, startDate, endDate, activeTab]);

  useEffect(() => {
    const handleAddCategoryToComparison = (event: CustomEvent) => {
      const { categoryId, categoryPath } = event.detail;
      console.log("Adding category to comparison:", categoryId, categoryPath);
      addCategoryToComparison(categoryId, categoryPath);
    };

    window.addEventListener("addCategoryToComparison", handleAddCategoryToComparison as EventListener);
    
    return () => {
      window.removeEventListener("addCategoryToComparison", handleAddCategoryToComparison as EventListener);
    };
  }, []);

  const addCategoryToComparison = (categoryId: string, categoryPath: string) => {
    if (selectedCategories.length >= 5) {
      toast.error("Você já selecionou o máximo de 5 categorias para comparação");
      return;
    }

    if (selectedCategories.includes(categoryId)) {
      toast.error("Esta categoria já está na comparação");
      return;
    }

    const getAllSubcategoryIds = (categoryId: string): string[] => {
      const subcatIds: string[] = [];
      
      const directSubcats = categories.filter(cat => cat.parentId === categoryId);
      for (const subcat of directSubcats) {
        subcatIds.push(subcat.id);
        
        const subsubcats = getAllSubcategoryIds(subcat.id);
        for (const subsubcatId of subsubcats) {
          subcatIds.push(subsubcatId);
        }
      }
      
      return subcatIds;
    };

    const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId)];
    
    const categoryTransactions = filteredTransactions.filter(t => 
      allCategoryIds.includes(t.categoryId)
    );
    
    const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    if (amount === 0) {
      toast.error("Esta categoria não tem transações no período selecionado");
      return;
    }

    setSelectedCategories(prevSelected => [...prevSelected, categoryId]);
    
    const newComparisonData = [
      ...comparisonData,
      {
        id: categoryId,
        name: categoryPath.split(" > ").pop() || "Desconhecido",
        path: categoryPath,
        amount
      }
    ];
    
    setComparisonData(newComparisonData);
    
    const comparisonElement = document.getElementById('category-comparison-section');
    if (comparisonElement) {
      comparisonElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const removeCategoryFromComparison = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    setComparisonData(comparisonData.filter(item => item.id !== categoryId));
  };

  const chartData = useMemo(() => {
    return comparisonData.map(item => ({
      category: item.name,
      amount: item.amount,
      categoryId: item.id,
      fill: getRandomColor(item.id)
    }));
  }, [comparisonData]);

  const handleExportComparison = () => {
    try {
      if (comparisonData.length === 0) {
        toast.error("Não há dados para exportar");
        return;
      }
      
      const exportData = comparisonData.map(item => ({
        Categoria: item.path,
        Valor: formatCurrency(item.amount).replace(/[€$]/g, '').trim()
      }));
      
      exportToExcel(
        exportData, 
        `comparacao_categorias_${startDate.toISOString().split('T')[0]}_a_${endDate.toISOString().split('T')[0]}`
      );
      
      toast.success("Dados de comparação exportados com sucesso");
    } catch (error) {
      console.error("Error exporting comparison data:", error);
      toast.error("Erro ao exportar dados de comparação");
    }
  };

  const totalAmount = useMemo(() => {
    return comparisonData.reduce((sum, item) => sum + item.amount, 0);
  }, [comparisonData]);

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
            <div className="text-center py-8 text-muted-foreground">
              Selecione categorias para comparar clicando no botão "Comparar" ao lado das categorias acima
            </div>
          ) : (
            <>
              <div className="h-[300px] mb-6">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis 
                        tickFormatter={(value) => `€${value}`}
                        width={80}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent 
                            formatter={(value) => [
                              `${formatCurrency(value as number)}`,
                              "Valor"
                            ]}
                          />
                        }
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Valor" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">% do Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.path}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(2) : 0}%
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCategoryFromComparison(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(totalAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">100%</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryComparison;

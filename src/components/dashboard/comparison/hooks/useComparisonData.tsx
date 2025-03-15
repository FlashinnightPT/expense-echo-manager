
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { exportToExcel } from "@/utils/exportUtils";
import { formatCurrency } from "@/utils/financialCalculations";
import { getAllSubcategoryIds, validateCategoryAddition, getRandomColor } from "../utils/comparisonChartUtils";

export const useComparisonData = (
  categories: any[],
  transactions: any[],
  startDate: Date,
  endDate: Date,
  activeTab: "expense" | "income"
) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

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

  const totalAmount = useMemo(() => {
    return comparisonData.reduce((sum, item) => sum + item.amount, 0);
  }, [comparisonData]);

  const chartData = useMemo(() => {
    return comparisonData.map((item) => ({
      category: item.name,
      amount: item.amount,
      categoryId: item.id,
      fill: getRandomColor(item.id, activeTab)
    }));
  }, [comparisonData, activeTab]);

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
  }, [filteredTransactions]); // Depends on filteredTransactions which changes with date range

  const addCategoryToComparison = (categoryId: string, categoryPath: string) => {
    const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId, categories)];
    
    // Validate if we can add this category
    if (!validateCategoryAddition(categoryId, selectedCategories, filteredTransactions, allCategoryIds)) {
      return;
    }

    const categoryTransactions = filteredTransactions.filter(t => 
      allCategoryIds.includes(t.categoryId)
    );
    
    const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
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

  return {
    selectedCategories,
    comparisonData,
    totalAmount,
    chartData,
    addCategoryToComparison,
    removeCategoryFromComparison,
    handleExportComparison
  };
};

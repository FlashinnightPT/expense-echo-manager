
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { exportToExcel } from "@/utils/exportUtils";
import { formatCurrency } from "@/utils/financialCalculations";
import { getAllSubcategoryIds, validateCategoryAddition, getRandomColor } from "../utils/comparisonChartUtils";

interface ComparisonItem {
  id: string;
  name: string;
  path: string;
  amount: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const useComparisonData = (
  categories: any[],
  transactions: any[],
  startDate: Date,
  endDate: Date,
  activeTab: "expense" | "income"
) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonItem[]>([]);
  const [autoScroll, setAutoScroll] = useState<boolean>(false);

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

  useEffect(() => {
    const handleAddCategoryToComparison = (event: CustomEvent) => {
      const { categoryId, categoryPath, customStartDate, customEndDate } = event.detail;
      console.log("Adding category to comparison:", categoryId, categoryPath);
      
      // Se datas personalizadas forem fornecidas, usá-las
      if (customStartDate && customEndDate) {
        addCategoryToComparison(
          categoryId, 
          categoryPath, 
          false, 
          new Date(customStartDate), 
          new Date(customEndDate)
        );
      } else {
        // Caso contrário, usar as datas atuais
        addCategoryToComparison(categoryId, categoryPath);
      }
    };

    window.addEventListener("addCategoryToComparison", handleAddCategoryToComparison as EventListener);
    
    return () => {
      window.removeEventListener("addCategoryToComparison", handleAddCategoryToComparison as EventListener);
    };
  }, [filteredTransactions]); // Depends on filteredTransactions which changes with date range

  const addCategoryToComparison = (
    categoryId: string, 
    categoryPath: string, 
    shouldScroll = autoScroll,
    customStartDate?: Date,
    customEndDate?: Date
  ) => {
    // Use either custom dates or current filter dates
    const effectiveStartDate = customStartDate || startDate;
    const effectiveEndDate = customEndDate || endDate;
    
    const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId, categories)];
    
    // Validate if we can add this category
    if (!validateCategoryAddition(categoryId, selectedCategories, filteredTransactions, allCategoryIds)) {
      return;
    }

    // Filter transactions based on effective dates
    const customFilteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= effectiveStartDate &&
        transactionDate <= effectiveEndDate &&
        t.type === activeTab
      );
    });
    
    const categoryTransactions = customFilteredTransactions.filter(t => 
      allCategoryIds.includes(t.categoryId)
    );
    
    const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    setSelectedCategories(prevSelected => [...prevSelected, categoryId]);
    
    const periodLabel = customStartDate && customEndDate 
      ? ` (${effectiveStartDate.toLocaleDateString()} - ${effectiveEndDate.toLocaleDateString()})`
      : '';
      
    const newComparisonData = [
      ...comparisonData,
      {
        id: `${categoryId}-${Date.now()}`,  // Use unique ID with timestamp
        name: `${categoryPath.split(" > ").pop() || "Desconhecido"}${periodLabel}`,
        path: `${categoryPath}${periodLabel}`,
        amount,
        dateRange: {
          start: effectiveStartDate,
          end: effectiveEndDate
        }
      }
    ];
    
    setComparisonData(newComparisonData);
    
    // Only scroll if shouldScroll is true
    if (shouldScroll) {
      const comparisonElement = document.getElementById('category-comparison-section');
      if (comparisonElement) {
        comparisonElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const removeCategoryFromComparison = (categoryId: string) => {
    const itemToRemove = comparisonData.find(item => item.id === categoryId);
    if (!itemToRemove) return;
    
    // Extract the original categoryId without timestamp
    const originalCategoryId = itemToRemove.id.split('-')[0];
    
    setSelectedCategories(selectedCategories.filter(id => id !== originalCategoryId));
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
        Valor: formatCurrency(item.amount).replace(/[€$]/g, '').trim(),
        "Data Início": item.dateRange?.start.toLocaleDateString() || startDate.toLocaleDateString(),
        "Data Fim": item.dateRange?.end.toLocaleDateString() || endDate.toLocaleDateString()
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

  const setScrollToComparison = (enabled: boolean) => {
    setAutoScroll(enabled);
  };

  return {
    selectedCategories,
    comparisonData,
    totalAmount,
    addCategoryToComparison,
    removeCategoryFromComparison,
    handleExportComparison,
    setScrollToComparison
  };
};

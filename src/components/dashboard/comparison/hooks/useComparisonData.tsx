
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  ComparisonItem, 
  calculateCategoryAmount, 
  createComparisonItem,
  exportComparisonData
} from "../utils/comparisonDataUtils";
import { validateCategoryAddition, getAllSubcategoryIds } from "../utils/comparisonChartUtils";
import { useComparisonEvents } from "./useComparisonEvents";

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

  // Filter transactions based on date range and type
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

  // Calculate total amount for all comparison data
  const totalAmount = useMemo(() => {
    return comparisonData.reduce((sum, item) => sum + item.amount, 0);
  }, [comparisonData]);

  const addCategoryToComparison = (
    categoryId: string, 
    categoryPath: string, 
    customStartDate?: Date,
    customEndDate?: Date
  ) => {
    // Use either custom dates or current filter dates
    const effectiveStartDate = customStartDate || startDate;
    const effectiveEndDate = customEndDate || endDate;
    const shouldScroll = autoScroll;
    
    // Check if we've already reached the maximum of 5 categories
    if (comparisonData.length >= 5) {
      toast.error("Máximo de 5 categorias permitidas para comparação");
      return;
    }
    
    // Check if this category is already in the comparison with the same date range
    const isDuplicate = comparisonData.some(item => {
      const categoryIdFromItem = item.id.split('-')[0]; // Extract the categoryId part
      const sameCategory = categoryIdFromItem === categoryId;
      
      const sameDateRange = item.dateRange && 
        item.dateRange.start.getTime() === effectiveStartDate.getTime() &&
        item.dateRange.end.getTime() === effectiveEndDate.getTime();
        
      return sameCategory && sameDateRange;
    });
    
    if (isDuplicate) {
      toast.error("Esta categoria já está na comparação para este período");
      return;
    }

    const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId, categories)];

    // Validate if we can add this category
    if (!validateCategoryAddition(categoryId, selectedCategories, filteredTransactions, allCategoryIds)) {
      return;
    }

    // Get transactions for the effective date range
    const customFilteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate >= effectiveStartDate &&
        transactionDate <= effectiveEndDate &&
        t.type === activeTab
      );
    });
    
    // Calculate the amount for this category in the selected period
    const amount = calculateCategoryAmount(
      categoryId, 
      customFilteredTransactions, 
      categories, 
      effectiveStartDate, 
      effectiveEndDate
    );
    
    // Add the category ID to our selected list
    setSelectedCategories(prevSelected => [...prevSelected, categoryId]);
    
    // Create a new comparison item with the calculated amount
    const newComparisonItem = createComparisonItem(
      categoryId,
      categoryPath,
      amount,
      effectiveStartDate,
      effectiveEndDate,
      !!customStartDate
    );
    
    // Add the new item to the comparison data
    setComparisonData(prevData => [...prevData, newComparisonItem]);
    
    // Only scroll if shouldScroll is true
    if (shouldScroll) {
      const comparisonElement = document.getElementById('category-comparison-section');
      if (comparisonElement) {
        comparisonElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Set up event listener for adding categories
  useComparisonEvents({
    onAddCategory: addCategoryToComparison,
    dependencies: [filteredTransactions]
  });

  const removeCategoryFromComparison = (categoryId: string) => {
    const itemToRemove = comparisonData.find(item => item.id === categoryId);
    if (!itemToRemove) return;
    
    // Extract the original categoryId without timestamp
    const originalCategoryId = itemToRemove.id.split('-')[0];
    
    setSelectedCategories(selectedCategories.filter(id => id !== originalCategoryId));
    setComparisonData(comparisonData.filter(item => item.id !== categoryId));
  };

  const handleExportComparison = () => {
    exportComparisonData(comparisonData, startDate, endDate);
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

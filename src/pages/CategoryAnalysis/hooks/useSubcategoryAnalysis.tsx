
import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";

export const useSubcategoryAnalysis = (
  selectedCategoryId: string,
  selectedYear: number,
  selectedMonth: number | null,
  activeTab: "expense" | "income",
  categories: TransactionCategory[],
  getFilteredTransactions: (year?: number, month?: number | undefined, type?: "income" | "expense") => any[]
) => {
  // States for subcategories and totals
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subcategoryData, setSubcategoryData] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Update data when filters change
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategoryData([]);
      setTotalAmount(0);
      setSelectedCategoryName("");
      return;
    }

    // Get filtered transactions
    const filteredTransactions = getFilteredTransactions(
      selectedYear,
      selectedMonth || undefined,
      activeTab
    );

    // Get the selected category
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) {
      setSubcategoryData([]);
      setTotalAmount(0);
      setSelectedCategoryName("");
      return;
    }

    setSelectedCategoryName(selectedCategory.name);

    // Get subcategories
    const subcategories = categories.filter(cat => cat.parentId === selectedCategoryId);
    
    // Calculate values for each subcategory
    const subcatData = subcategories.map(subcat => {
      // Get all subcategories (including deeper levels)
      const getAllSubcats = (parentId: string): string[] => {
        const directSubcats = categories.filter(c => c.parentId === parentId);
        const ids = directSubcats.map(c => c.id);
        const nestedIds = directSubcats.flatMap(c => getAllSubcats(c.id));
        return [...ids, ...nestedIds];
      };
      
      const allSubcatIds = [subcat.id, ...getAllSubcats(subcat.id)];
      
      // Calculate the total amount for this subcategory and its subcategories
      const amount = filteredTransactions
        .filter(t => allSubcatIds.includes(t.categoryId))
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        category: subcat,
        amount,
        percentage: 0 // Will be calculated after we have the total
      };
    });
    
    // Calculate transactions directly linked to the main category
    const directTransactions = filteredTransactions
      .filter(t => t.categoryId === selectedCategoryId)
      .reduce((sum, t) => sum + t.amount, 0);
      
    // Add the category itself if it has direct transactions
    if (directTransactions > 0) {
      subcatData.unshift({
        category: {
          ...selectedCategory,
          name: "(Diretamente nesta categoria)"
        },
        amount: directTransactions,
        percentage: 0
      });
    }
    
    // Calculate the total
    const total = subcatData.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    
    // Calculate percentages
    const dataWithPercentages = subcatData.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));
    
    setSubcategoryData(dataWithPercentages);
  }, [selectedCategoryId, selectedYear, selectedMonth, activeTab, categories, getFilteredTransactions]);

  return {
    selectedCategoryName,
    subcategoryData,
    totalAmount
  };
};

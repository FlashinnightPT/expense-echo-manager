
import { useEffect } from "react";

interface ComparisonEventProps {
  onAddCategory: (
    categoryId: string, 
    categoryPath: string, 
    customStartDate?: Date, 
    customEndDate?: Date
  ) => void;
  dependencies?: any[];
}

export const useComparisonEvents = ({ 
  onAddCategory,
  dependencies = []
}: ComparisonEventProps) => {
  useEffect(() => {
    const handleAddCategoryToComparison = (event: CustomEvent) => {
      const { categoryId, categoryPath, customStartDate, customEndDate } = event.detail;
      console.log("Adding category to comparison:", categoryId, categoryPath);
      
      // Se datas personalizadas forem fornecidas, usá-las
      if (customStartDate && customEndDate) {
        onAddCategory(
          categoryId, 
          categoryPath, 
          new Date(customStartDate), 
          new Date(customEndDate)
        );
      } else {
        // Caso contrário, usar as datas atuais
        onAddCategory(categoryId, categoryPath);
      }
    };

    window.addEventListener(
      "addCategoryToComparison", 
      handleAddCategoryToComparison as EventListener
    );
    
    return () => {
      window.removeEventListener(
        "addCategoryToComparison", 
        handleAddCategoryToComparison as EventListener
      );
    };
  }, [...dependencies]);
};

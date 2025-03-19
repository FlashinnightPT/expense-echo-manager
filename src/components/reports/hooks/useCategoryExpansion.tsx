
import { useState } from "react";

export function useCategoryExpansion() {
  // State to track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const isExpanded = (categoryId: string) => {
    return !!expandedCategories[categoryId];
  };

  return {
    expandedCategories,
    toggleCategory,
    isExpanded
  };
}

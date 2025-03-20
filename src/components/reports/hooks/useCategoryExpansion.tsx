
import { useState, useCallback } from "react";

export const useCategoryExpansion = () => {
  // Store expanded category IDs in a Set for O(1) lookup
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Toggle expansion state of a category
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prevExpanded => {
      // Create a new Set from the previous one
      const newExpanded = new Set(prevExpanded);
      
      // If the category is already expanded, remove it, otherwise add it
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      
      return newExpanded;
    });
  }, []);

  // Check if a category is expanded
  const isExpanded = useCallback((categoryId: string) => {
    return expandedCategories.has(categoryId);
  }, [expandedCategories]);

  // Expand all categories
  const expandAll = useCallback((categoryIds: string[]) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      categoryIds.forEach(id => newExpanded.add(id));
      return newExpanded;
    });
  }, []);

  // Collapse all categories
  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  return {
    toggleCategory,
    isExpanded,
    expandAll,
    collapseAll,
    expandedCategories: Array.from(expandedCategories)
  };
};

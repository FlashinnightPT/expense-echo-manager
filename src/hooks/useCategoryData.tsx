
import { useCategoriesCore } from "./category/useCategoriesCore";
import { useCategoryActions } from "./category/useCategoryActions";
import { useCategoryUpdates } from "./category/useCategoryUpdates";
import { useCategoryTree } from "./category/useCategoryTree";

/**
 * Main hook that composes all category functionality
 * This maintains the same interface as the original hook
 * to ensure no components break when using it
 */
export const useCategoryData = () => {
  // Get core state and data loading
  const { 
    categoryList, 
    setCategoryList, 
    isLoading, 
    setIsLoading 
  } = useCategoriesCore();
  
  // Get actions for adding/removing categories
  const {
    handleSaveCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    clearNonRootCategories
  } = useCategoryActions({
    categoryList,
    setCategoryList,
    setIsLoading
  });
  
  // Get methods for updating existing categories
  const {
    updateCategoryName,
    updateCategoryActive,
    updateFixedExpense
  } = useCategoryUpdates({
    categoryList,
    setCategoryList,
    setIsLoading
  });
  
  // Get methods for category tree operations
  const {
    moveCategory
  } = useCategoryTree({
    categoryList,
    setCategoryList,
    setIsLoading
  });

  // Return the same interface as the original hook to maintain compatibility
  return {
    categoryList,
    isLoading,
    handleSaveCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    updateCategoryName,
    moveCategory,
    updateFixedExpense,
    updateCategoryActive,
    clearNonRootCategories
  };
};

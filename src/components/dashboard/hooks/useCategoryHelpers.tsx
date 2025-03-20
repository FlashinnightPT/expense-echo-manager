
import { TransactionCategory } from "@/utils/mockData";

export const useCategoryHelpers = (categories: TransactionCategory[]) => {
  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };
  
  const getCategoryPath = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    const path = [category.name];
    let currentCategory = category;
    
    while (currentCategory.parentId) {
      const parentCategory = categories.find(cat => cat.id === currentCategory.parentId);
      if (!parentCategory) break;
      
      path.unshift(parentCategory.name);
      currentCategory = parentCategory;
    }
    
    return path;
  };

  return {
    getCategoryById,
    getCategoryPath
  };
};

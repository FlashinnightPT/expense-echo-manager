
import { toast } from "sonner";

// Define a function to get random colors for charts based on category ID
export const getRandomColor = (id: string, type: 'expense' | 'income') => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const baseColors = type === "expense" 
    ? ['#ef4444', '#f87171', '#fca5a5', '#fee2e2', '#fecaca'] 
    : ['#22c55e', '#4ade80', '#86efac', '#dcfce7', '#bbf7d0'];
  
  return baseColors[Math.abs(hash) % baseColors.length];
};

// Helper function to validate category additions
export const validateCategoryAddition = (
  categoryId: string,
  selectedCategories: string[],
  filteredTransactions: any[],
  allCategoryIds: string[]
) => {
  if (selectedCategories.length >= 5) {
    toast.error("Você já selecionou o máximo de 5 categorias para comparação");
    return false;
  }

  if (selectedCategories.includes(categoryId)) {
    toast.error("Esta categoria já está na comparação");
    return false;
  }

  const categoryTransactions = filteredTransactions.filter(t => 
    allCategoryIds.includes(t.categoryId)
  );
  
  const amount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  if (amount === 0) {
    toast.error("Esta categoria não tem transações no período selecionado");
    return false;
  }

  return true;
};

// Helper to get all subcategory IDs for a category
export const getAllSubcategoryIds = (categoryId: string, categories: any[]): string[] => {
  const subcatIds: string[] = [];
  
  const directSubcats = categories.filter(cat => cat.parentId === categoryId);
  for (const subcat of directSubcats) {
    subcatIds.push(subcat.id);
    
    const subsubcats = getAllSubcategoryIds(subcat.id, categories);
    for (const subsubcatId of subsubcats) {
      subcatIds.push(subsubcatId);
    }
  }
  
  return subcatIds;
};

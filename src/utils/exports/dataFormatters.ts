
import { Transaction, TransactionCategory } from "@/utils/mockData";

// Get the full category path for a category
const getCategoryPath = (
  categoryId: string,
  categories: TransactionCategory[]
): string => {
  const path: string[] = [];
  let currentCategoryId = categoryId;
  
  while (currentCategoryId) {
    const category = categories.find(cat => cat.id === currentCategoryId);
    if (!category) break;
    
    path.unshift(category.name);
    currentCategoryId = category.parentId || "";
  }
  
  return path.join(" > ");
};

export const prepareTransactionsForExport = (
  transactions: Transaction[],
  categories: TransactionCategory[]
) => {
  return transactions.map(transaction => {
    const categoryPath = getCategoryPath(transaction.categoryId, categories);
    
    return {
      Description: transaction.description || "",
      Amount: transaction.amount,
      Date: transaction.date,
      Type: transaction.type === "income" ? "Receita" : "Despesa",
      Category: categoryPath
    };
  });
};

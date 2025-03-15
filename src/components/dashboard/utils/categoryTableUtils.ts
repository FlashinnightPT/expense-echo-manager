
import { Transaction, TransactionCategory } from "@/utils/mockData";

/**
 * Calculate the total amount for a category, including all subcategories
 */
export function calculateCategoryTotal(
  categoryId: string,
  filteredTransactions: Transaction[],
  categories: TransactionCategory[]
): number {
  // Get all subcategories recursively
  const getAllSubcategoryIds = (id: string): string[] => {
    const directSubcats = categories.filter((cat) => cat.parentId === id);
    let allSubcatIds: string[] = directSubcats.map((cat) => cat.id);
    
    directSubcats.forEach((subcat) => {
      allSubcatIds = [...allSubcatIds, ...getAllSubcategoryIds(subcat.id)];
    });
    
    return allSubcatIds;
  };

  // Get all IDs of subcategories, including the ID of the current category
  const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId)];

  // Calculate the sum of all transactions belonging to these categories
  return filteredTransactions
    .filter((transaction) => allCategoryIds.includes(transaction.categoryId))
    .reduce((total, transaction) => total + transaction.amount, 0);
}

/**
 * Calculate the amount for transactions directly assigned to this category
 */
export function calculateCategoryTransactionAmount(
  categoryId: string,
  filteredTransactions: Transaction[]
): number {
  return filteredTransactions
    .filter((transaction) => transaction.categoryId === categoryId)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

/**
 * Get subcategories of a category
 */
export function getSubcategories(
  parentId: string,
  categories: TransactionCategory[]
): TransactionCategory[] {
  return categories.filter((cat) => cat.parentId === parentId);
}

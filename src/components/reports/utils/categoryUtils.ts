
import { Transaction, TransactionCategory } from "@/utils/mockData";

/**
 * Gets all subcategory IDs for a category recursively
 */
export const getAllSubcategoryIds = (
  categoryId: string, 
  categories: TransactionCategory[]
): string[] => {
  const subcats = categories.filter(cat => cat.parentId === categoryId);
  if (subcats.length === 0) return [categoryId];
  
  return [
    categoryId,
    ...subcats.flatMap(subcat => getAllSubcategoryIds(subcat.id, categories))
  ];
};

/**
 * Get transactions for a specific month
 */
export const getMonthTransactions = (
  transactions: Transaction[],
  month: number
): Transaction[] => {
  return transactions.filter(transaction => {
    const date = new Date(transaction.date);
    const transactionMonth = date.getMonth() + 1;
    return transactionMonth === month;
  });
};

/**
 * Calculate monthly amounts for a category
 */
export const calculateMonthlyAmounts = (
  categoryId: string,
  monthlyTransactions: Record<number, Transaction[]>,
  categories: TransactionCategory[]
): Record<number, number> => {
  const monthlyAmounts: Record<number, number> = {};
  
  for (let month = 1; month <= 12; month++) {
    const monthTransactions = monthlyTransactions[month];
    const allCategoryIds = getAllSubcategoryIds(categoryId, categories);
    
    // Sum transactions for this category and all its children
    monthlyAmounts[month] = monthTransactions
      .filter(t => allCategoryIds.includes(t.categoryId))
      .reduce((sum, t) => sum + t.amount, 0);
  }
  
  return monthlyAmounts;
};

/**
 * Find root categories of a specific type
 */
export const findRootCategories = (
  categories: TransactionCategory[],
  type: 'income' | 'expense'
): TransactionCategory[] => {
  return categories.filter(cat => 
    cat.type === type && cat.level === 1
  );
};

/**
 * Calculate totals across all months
 */
export const calculateTotals = (monthlyAmounts: Record<number, number>): {
  yearlyTotal: number;
  monthlyAverage: number;
} => {
  const yearlyTotal = Object.values(monthlyAmounts).reduce((sum, amount) => sum + amount, 0);
  const monthlyAverage = yearlyTotal / 12;
  
  return { yearlyTotal, monthlyAverage };
};

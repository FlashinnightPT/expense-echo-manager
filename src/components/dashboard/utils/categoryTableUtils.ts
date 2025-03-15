
import { Transaction, TransactionCategory } from "@/utils/mockData";

/**
 * Calculate the total amount for a category, including all subcategories
 */
export function calculateCategoryTotal(
  categoryId: string,
  filteredTransactions: Transaction[],
  categories: TransactionCategory[]
): number {
  // Obter todas as subcategorias recursivamente
  const getAllSubcategoryIds = (id: string): string[] => {
    const directSubcats = categories.filter((cat) => cat.parentId === id);
    let allSubcatIds: string[] = directSubcats.map((cat) => cat.id);
    
    directSubcats.forEach((subcat) => {
      allSubcatIds = [...allSubcatIds, ...getAllSubcategoryIds(subcat.id)];
    });
    
    return allSubcatIds;
  };

  // Obter todos os IDs de subcategorias, incluindo o ID da categoria atual
  const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId)];

  // Calcular a soma de todas as transações pertencentes a essas categorias
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

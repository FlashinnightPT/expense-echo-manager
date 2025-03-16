
import { Transaction, TransactionCategory } from "../mockData";
import { formatCurrency, getMonthName } from "../financialCalculations";

/**
 * Formats monthly data for export
 */
export const prepareMonthlyDataForExport = (
  monthlyData: any[],
  year: number
) => {
  return monthlyData.map(data => ({
    Month: getMonthName(data.month),
    Year: year,
    Income: formatCurrency(data.income).replace(/[€$]/g, '').trim(),
    Expense: formatCurrency(data.expense).replace(/[€$]/g, '').trim(),
    Balance: formatCurrency(data.income - data.expense).replace(/[€$]/g, '').trim()
  }));
};

/**
 * Formats transaction data for export
 */
export const prepareTransactionsForExport = (
  transactions: Transaction[]
) => {
  return transactions.map(t => {
    const categoryName = t.categoryId || '';
    
    return {
      Description: t.description,
      Amount: formatCurrency(t.amount).replace(/[€$]/g, '').trim(),
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type === 'income' ? 'Receita' : 'Despesa',
      Category: categoryName
    };
  });
};

/**
 * Get the category path as a single string
 */
export const getCategoryPathString = (
  categoryId: string,
  categories: TransactionCategory[]
): string => {
  // Create a map for quick lookup
  const categoryMap = new Map<string, TransactionCategory>();
  categories.forEach(cat => categoryMap.set(cat.id, cat));
  
  // Build the path
  const path: string[] = [];
  let currentId = categoryId;
  
  while (currentId) {
    const category = categoryMap.get(currentId);
    if (!category) break;
    
    path.unshift(category.name);
    currentId = category.parentId || '';
  }
  
  return path.join(' > ');
};

/**
 * Create a hierarchical representation of categories for the monthly report format
 */
export const prepareCategoryHierarchyForReport = (
  categories: TransactionCategory[],
  transactions: Transaction[],
  selectedYear: number,
  type: 'income' | 'expense'
) => {
  // Filter root categories of the specified type
  const rootCategories = categories.filter(c => c.level === 1 && c.type === type);
  
  // Create a map to hold monthly totals by category ID
  const monthlyTotals: Record<string, Record<number, number>> = {};
  
  // Initialize the monthly totals map for all categories
  categories.forEach(cat => {
    monthlyTotals[cat.id] = {};
    for (let month = 1; month <= 12; month++) {
      monthlyTotals[cat.id][month] = 0;
    }
  });
  
  // Calculate monthly totals for each category
  transactions.forEach(t => {
    if (t.type !== type) return;
    
    const transactionDate = new Date(t.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;
    
    if (transactionYear !== selectedYear) return;
    
    // Get the category and all its parent categories
    const categoryId = t.categoryId;
    if (!categoryId) return;
    
    // Add the amount to this category's monthly total
    if (monthlyTotals[categoryId]) {
      monthlyTotals[categoryId][transactionMonth] = 
        (monthlyTotals[categoryId][transactionMonth] || 0) + t.amount;
    }
  });
  
  // Create the hierarchical structure for the report
  const hierarchy = rootCategories.map(rootCat => {
    const subcategories = categories
      .filter(c => c.parentId === rootCat.id)
      .map(subCat => {
        // Get the deepest level subcategories
        const level3Categories = categories
          .filter(c => c.parentId === subCat.id)
          .map(level3Cat => ({
            category: level3Cat,
            monthlyValues: monthlyTotals[level3Cat.id] || {}
          }));
          
        return {
          category: subCat,
          monthlyValues: monthlyTotals[subCat.id] || {},
          subcategories: level3Categories
        };
      });
      
    return {
      category: rootCat,
      monthlyValues: monthlyTotals[rootCat.id] || {},
      subcategories
    };
  });
  
  return hierarchy;
};

/**
 * Calculate the total for each month across all categories of a specific type
 */
export const calculateMonthlyTotalsByType = (
  transactions: Transaction[],
  selectedYear: number,
  type: 'income' | 'expense'
) => {
  const monthlyTotals: Record<number, number> = {};
  
  // Initialize
  for (let month = 1; month <= 12; month++) {
    monthlyTotals[month] = 0;
  }
  
  // Calculate
  transactions.forEach(t => {
    if (t.type !== type) return;
    
    const transactionDate = new Date(t.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() +.1;
    
    if (transactionYear !== selectedYear) return;
    
    monthlyTotals[transactionMonth] = 
      (monthlyTotals[transactionMonth] || 0) + t.amount;
  });
  
  return monthlyTotals;
};

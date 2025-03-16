
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
  // Filter categories of the specified type
  const typeCategories = categories.filter(c => c.type === type);
  
  // Create a map to hold monthly totals by category ID
  const monthlyTotals: Record<string, Record<number, number>> = {};
  
  // Initialize the monthly totals map for all categories
  typeCategories.forEach(cat => {
    monthlyTotals[cat.id] = {};
    for (let month = 1; month <= 12; month++) {
      monthlyTotals[cat.id][month] = 0;
    }
  });
  
  // Calculate monthly totals for each category from transactions
  transactions.forEach(t => {
    if (t.type !== type) return;
    
    const transactionDate = new Date(t.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1;
    
    if (transactionYear !== selectedYear) return;
    
    const categoryId = t.categoryId;
    if (!categoryId) return;
    
    // Add the amount to this category's monthly total
    if (monthlyTotals[categoryId]) {
      monthlyTotals[categoryId][transactionMonth] = 
        (monthlyTotals[categoryId][transactionMonth] || 0) + t.amount;
    }
    
    // Also add to parent categories
    let parentId = getCategoryParent(categoryId, categories);
    while (parentId) {
      if (monthlyTotals[parentId]) {
        monthlyTotals[parentId][transactionMonth] = 
          (monthlyTotals[parentId][transactionMonth] || 0) + t.amount;
      }
      parentId = getCategoryParent(parentId, categories);
    }
  });
  
  // Helper function to get parent category ID
  function getCategoryParent(categoryId: string, cats: TransactionCategory[]): string {
    const category = cats.find(c => c.id === categoryId);
    return category?.parentId || '';
  }
  
  // Filter root categories of the specified type (level 1)
  const rootCategories = typeCategories.filter(c => c.level === 1);
  
  // Create the hierarchical structure for the report
  const hierarchy = rootCategories.map(rootCat => {
    const level2Categories = typeCategories
      .filter(c => c.parentId === rootCat.id)
      .map(level2Cat => {
        const level3Categories = typeCategories
          .filter(c => c.parentId === level2Cat.id)
          .map(level3Cat => ({
            category: level3Cat,
            monthlyValues: monthlyTotals[level3Cat.id] || {}
          }));
          
        return {
          category: level2Cat,
          monthlyValues: monthlyTotals[level2Cat.id] || {},
          subcategories: level3Categories
        };
      });
      
    return {
      category: rootCat,
      monthlyValues: monthlyTotals[rootCat.id] || {},
      subcategories: level2Categories
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
    const transactionMonth = transactionDate.getMonth() + 1;
    
    if (transactionYear !== selectedYear) return;
    
    monthlyTotals[transactionMonth] = 
      (monthlyTotals[transactionMonth] || 0) + t.amount;
  });
  
  return monthlyTotals;
};

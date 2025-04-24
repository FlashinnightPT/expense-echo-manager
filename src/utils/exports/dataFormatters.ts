
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

// Prepare category hierarchy for the monthly report
export const prepareCategoryHierarchyForReport = (
  categories: TransactionCategory[],
  transactions: Transaction[],
  year: number,
  type: 'income' | 'expense'
) => {
  // Create a mapping of categories by id for quick lookup
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = { 
      ...cat, 
      children: [], 
      monthlyTotals: Array(12).fill(0),
      totalAmount: 0 
    };
    return acc;
  }, {} as Record<string, any>);
  
  // Build the category hierarchy
  const rootCategories: any[] = [];
  
  Object.values(categoryMap).forEach(cat => {
    if (!cat.parentId) {
      rootCategories.push(cat);
    } else if (categoryMap[cat.parentId]) {
      categoryMap[cat.parentId].children.push(cat);
    }
  });
  
  // Calculate transaction totals for each category
  transactions
    .filter(t => t.type === type && new Date(t.date).getFullYear() === year)
    .forEach(transaction => {
      if (categoryMap[transaction.categoryId]) {
        const month = new Date(transaction.date).getMonth();
        categoryMap[transaction.categoryId].monthlyTotals[month] += transaction.amount;
        categoryMap[transaction.categoryId].totalAmount += transaction.amount;
        
        // Update parent categories
        let parentId = categoryMap[transaction.categoryId].parentId;
        while (parentId && categoryMap[parentId]) {
          categoryMap[parentId].monthlyTotals[month] += transaction.amount;
          categoryMap[parentId].totalAmount += transaction.amount;
          parentId = categoryMap[parentId].parentId;
        }
      }
    });
  
  return rootCategories;
};

// Calculate monthly totals by transaction type
export const calculateMonthlyTotalsByType = (
  transactions: Transaction[],
  year: number,
  type: 'income' | 'expense'
) => {
  const monthlyTotals: Record<number, number> = {};
  
  // Initialize months 1-12
  for (let i = 1; i <= 12; i++) {
    monthlyTotals[i] = 0;
  }
  
  // Sum transactions by month
  transactions
    .filter(t => t.type === type && new Date(t.date).getFullYear() === year)
    .forEach(transaction => {
      const month = new Date(transaction.date).getMonth() + 1; // Convert from 0-indexed to 1-indexed
      monthlyTotals[month] += transaction.amount;
    });
  
  return monthlyTotals;
};

// Helper function for preparing monthly data export
export const prepareMonthlyDataForExport = (tableData: any[], year: number) => {
  return tableData.map(row => {
    const result: Record<string, any> = {
      Category: row.category || ''
    };
    
    // Add months and totals
    for (let i = 1; i <= 12; i++) {
      result[`Month_${i}`] = row[`month_${i}`] || 0;
    }
    
    result['Total'] = row.total || 0;
    result['Monthly Average'] = row.average || 0;
    
    return result;
  });
};

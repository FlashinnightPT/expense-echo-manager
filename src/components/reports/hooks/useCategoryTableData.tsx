
import { useMemo } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { buildCategoryHierarchy } from "@/utils/financialCalculations";

export interface CategoryTableData {
  categoryHierarchy: any[];
  monthlyTotals: Record<number, number>;
  yearlyTotal: number;
  monthlyAverage: number;
  hasData: boolean;
  monthlyTransactions: Record<number, Transaction[]>;
}

export function useCategoryTableData(
  transactions: Transaction[],
  categories: TransactionCategory[],
  year: number,
  type: 'income' | 'expense'
): CategoryTableData {
  // Organize transactions by month
  const monthlyTransactions = useMemo(() => {
    const result: Record<number, Transaction[]> = {};
    
    // Initialize all months
    for (let i = 1; i <= 12; i++) {
      result[i] = [];
    }
    
    // Group transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth() + 1;
      
      if (result[month]) {
        result[month].push(transaction);
      }
    });
    
    return result;
  }, [transactions]);
  
  // Create a hierarchical structure of categories
  const categoryHierarchy = useMemo(() => {
    // Build a map of categories by ID for quick lookup
    const categoryMap = new Map<string, TransactionCategory>();
    categories.forEach(category => {
      categoryMap.set(category.id, category);
    });
    
    // Find root categories (level 1)
    const rootCategories = categories.filter(cat => 
      cat.type === type && cat.level === 1
    );
    
    // Create a hierarchy of categories with their monthly data
    const buildHierarchy = (parentCategories: TransactionCategory[]) => {
      return parentCategories.map(parent => {
        // Find all child categories
        const children = categories.filter(cat => cat.parentId === parent.id);
        
        // Calculate monthly amounts for this category
        const monthlyAmounts: Record<number, number> = {};
        
        for (let month = 1; month <= 12; month++) {
          const monthTransactions = monthlyTransactions[month];
          
          // Get all subcategory IDs including this category
          const getAllSubcategoryIds = (categoryId: string): string[] => {
            const subcats = categories.filter(cat => cat.parentId === categoryId);
            if (subcats.length === 0) return [categoryId];
            
            return [
              categoryId,
              ...subcats.flatMap(subcat => getAllSubcategoryIds(subcat.id))
            ];
          };
          
          const allCategoryIds = getAllSubcategoryIds(parent.id);
          
          // Sum transactions for this category and all its children
          monthlyAmounts[month] = monthTransactions
            .filter(t => allCategoryIds.includes(t.categoryId))
            .reduce((sum, t) => sum + t.amount, 0);
        }
        
        // Calculate yearly total and monthly average
        const yearlyTotal = Object.values(monthlyAmounts).reduce((sum, amount) => sum + amount, 0);
        const monthlyAverage = yearlyTotal / 12;
        
        return {
          category: parent,
          children: buildHierarchy(children),
          monthlyAmounts,
          yearlyTotal,
          monthlyAverage
        };
      });
    };
    
    return buildHierarchy(rootCategories);
  }, [categories, monthlyTransactions, type]);
  
  // Calculate monthly totals across all categories
  const monthlyTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    
    for (let month = 1; month <= 12; month++) {
      totals[month] = 0;
      
      // Sum all transactions for this month and type
      totals[month] = monthlyTransactions[month]
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
    }
    
    return totals;
  }, [monthlyTransactions, type]);
  
  // Calculate yearly total and monthly average
  const yearlyTotal = useMemo(() => {
    return Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
  }, [monthlyTotals]);
  
  const monthlyAverage = useMemo(() => {
    return yearlyTotal / 12;
  }, [yearlyTotal]);
  
  // Check if there is any data to display
  const hasData = useMemo(() => {
    return yearlyTotal > 0;
  }, [yearlyTotal]);

  return {
    categoryHierarchy,
    monthlyTotals,
    yearlyTotal,
    monthlyAverage,
    hasData,
    monthlyTransactions
  };
}

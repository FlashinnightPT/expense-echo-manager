
import { useMemo } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { 
  getAllSubcategoryIds,
  calculateMonthlyAmounts,
  findRootCategories,
  calculateTotals,
  findCategoriesByType
} from "../utils/categoryUtils";
import { 
  organizeTransactionsByMonth,
  calculateMonthlyTotals
} from "../utils/transactionUtils";

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
    return organizeTransactionsByMonth(transactions);
  }, [transactions]);
  
  // Create a hierarchical structure of categories
  const categoryHierarchy = useMemo(() => {
    // Get all categories of the given type
    const typeCategories = findCategoriesByType(categories, type);
    
    // Find root categories (level 1)
    const rootCategories = findRootCategories(categories, type);
    
    // Build category lookup map for efficient parent-child relationships
    const categoryMap = new Map<string, TransactionCategory>();
    categories.forEach(cat => categoryMap.set(cat.id, cat));
    
    // Create a hierarchy of categories with their monthly data
    const buildHierarchy = (parentCategories: TransactionCategory[]) => {
      return parentCategories.map(parent => {
        // Find all child categories
        const children = categories.filter(cat => cat.parentId === parent.id);
        
        // Calculate monthly amounts for this category
        const monthlyAmounts = calculateMonthlyAmounts(
          parent.id, 
          monthlyTransactions, 
          categories
        );
        
        // Calculate yearly total and monthly average
        const { yearlyTotal, monthlyAverage } = calculateTotals(monthlyAmounts);
        
        // Always include children in the hierarchy, even if they have no transactions
        return {
          category: parent,
          children: children.length > 0 ? buildHierarchy(children) : [],
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
    return calculateMonthlyTotals(monthlyTransactions, type);
  }, [monthlyTransactions, type]);
  
  // Calculate yearly total and monthly average
  const yearlyTotal = useMemo(() => {
    return Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
  }, [monthlyTotals]);
  
  const monthlyAverage = useMemo(() => {
    return yearlyTotal / 12;
  }, [yearlyTotal]);
  
  // Check if there are categories to display of this type, not just transactions
  const hasData = useMemo(() => {
    return categories.some(cat => cat.type === type);
  }, [categories, type]);

  return {
    categoryHierarchy,
    monthlyTotals,
    yearlyTotal,
    monthlyAverage,
    hasData,
    monthlyTransactions
  };
}

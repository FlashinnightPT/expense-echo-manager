
import { MonthlyData, YearlyData, Transaction, TransactionCategory, getCategoryById } from './mockData';

export interface FinancialSummary {
  income: number;
  expense: number;
  savings: number;
  investment: number;
  balance: number;
  savingsRate: number; // as percentage
}

// Calculate financial summary from monthly data
export const calculateMonthlySummary = (monthData: MonthlyData): FinancialSummary => {
  const income = monthData.income;
  const expense = monthData.expense;
  const savings = monthData.savings;
  const investment = monthData.investment;
  const balance = income - expense;
  const savingsRate = income > 0 ? ((savings + investment) / income) * 100 : 0;

  return {
    income,
    expense,
    savings,
    investment,
    balance,
    savingsRate: Math.round(savingsRate * 10) / 10 // Round to 1 decimal place
  };
};

// Calculate financial summary from yearly data
export const calculateYearlySummary = (yearData: YearlyData): FinancialSummary => {
  const income = yearData.income;
  const expense = yearData.expense;
  const savings = yearData.savings;
  const investment = yearData.investment;
  const balance = income - expense;
  const savingsRate = income > 0 ? ((savings + investment) / income) * 100 : 0;

  return {
    income,
    expense,
    savings,
    investment,
    balance,
    savingsRate: Math.round(savingsRate * 10) / 10 // Round to 1 decimal place
  };
};

// Calculate monthly averages from yearly data
export const calculateMonthlyAverages = (yearData: YearlyData): FinancialSummary => {
  const summary = calculateYearlySummary(yearData);
  
  return {
    income: Math.round((summary.income / 12) * 100) / 100,
    expense: Math.round((summary.expense / 12) * 100) / 100,
    savings: Math.round((summary.savings / 12) * 100) / 100,
    investment: Math.round((summary.investment / 12) * 100) / 100,
    balance: Math.round((summary.balance / 12) * 100) / 100,
    savingsRate: summary.savingsRate // Savings rate remains the same
  };
};

// Format currency amount
export const formatCurrency = (amount: number, currency: string = '€'): string => {
  return `${amount.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${currency}`;
};

// Calculate year-over-year growth
export const calculateYoYGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10; // as percentage, rounded to 1 decimal
};

// Get data for a specific month
export const getMonthData = (monthlyData: MonthlyData[], year: number, month: number): MonthlyData | undefined => {
  return monthlyData.find(data => data.year === year && data.month === month);
};

// Get data for a specific year
export const getYearData = (yearlyData: YearlyData[], year: number): YearlyData | undefined => {
  return yearlyData.find(data => data.year === year);
};

// Get transactions for a specific category
export const getTransactionsForCategory = (
  transactions: Transaction[], 
  categoryId: string, 
  includeSubcategories: boolean = true,
  categories: TransactionCategory[]
): Transaction[] => {
  if (!includeSubcategories) {
    return transactions.filter(t => t.categoryId === categoryId);
  }
  
  // Get all subcategory IDs
  const subcategoryIds = new Set<string>([categoryId]);
  
  const addSubcategoryIds = (parentId: string) => {
    const subcategories = categories.filter(c => c.parentId === parentId);
    subcategories.forEach(subcat => {
      subcategoryIds.add(subcat.id);
      addSubcategoryIds(subcat.id);
    });
  };
  
  addSubcategoryIds(categoryId);
  
  return transactions.filter(t => subcategoryIds.has(t.categoryId));
};

// Get the path to a category (including all parent categories)
export const getCategoryPath = (categoryId: string): TransactionCategory[] => {
  const result: TransactionCategory[] = [];
  let currentCategory = getCategoryById(categoryId);
  
  while (currentCategory) {
    result.unshift(currentCategory);
    
    if (currentCategory.parentId) {
      currentCategory = getCategoryById(currentCategory.parentId);
    } else {
      break;
    }
  }
  
  return result;
};

// Get month name
export const getMonthName = (month: number, short: boolean = false): string => {
  const date = new Date(2000, month - 1, 1);
  return date.toLocaleString('pt-PT', { month: short ? 'short' : 'long' });
};

// Make first letter uppercase
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

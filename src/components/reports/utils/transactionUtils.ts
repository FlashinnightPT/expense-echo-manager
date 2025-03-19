
import { Transaction } from "@/utils/mockData";

/**
 * Organize transactions by month
 */
export const organizeTransactionsByMonth = (
  transactions: Transaction[]
): Record<number, Transaction[]> => {
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
};

/**
 * Calculate monthly totals across all categories
 */
export const calculateMonthlyTotals = (
  monthlyTransactions: Record<number, Transaction[]>,
  type: 'income' | 'expense'
): Record<number, number> => {
  const totals: Record<number, number> = {};
  
  for (let month = 1; month <= 12; month++) {
    // Sum all transactions for this month and type
    totals[month] = monthlyTransactions[month]
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }
  
  return totals;
};

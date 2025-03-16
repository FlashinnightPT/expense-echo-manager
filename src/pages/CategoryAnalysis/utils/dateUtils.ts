
/**
 * Creates date objects for filtering based on selected year and month
 */
export const createDateRange = (selectedYear: number, selectedMonth: number | null) => {
  const startMonth = Number(selectedMonth !== null ? selectedMonth : 0);
  const endMonth = Number(selectedMonth !== null ? selectedMonth + 1 : 12);
  
  const startDate = new Date(Number(selectedYear), startMonth, 1);
  const endDate = new Date(Number(selectedYear), endMonth, 0);
  
  return { startDate, endDate };
};

/**
 * Gets available years from transaction data
 */
export const getAvailableYears = (transactions: any[]) => {
  return Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear()))
  ).sort((a, b) => b - a) as number[];
};

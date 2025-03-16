
import { formatCurrency } from "../../financialCalculations";

/**
 * Formats a number as currency string without currency symbol for Excel
 */
export const formatNumberForExcel = (value: number): string => {
  return formatCurrency(value).replace(/[€$]/g, '').trim();
};

/**
 * Calculates the yearly total from monthly values
 */
export const calculateYearlyTotal = (monthlyValues: Record<number, number>): number => {
  return Object.values(monthlyValues).reduce((sum, val) => sum + val, 0);
};

/**
 * Calculates the monthly average from yearly total
 */
export const calculateMonthlyAverage = (yearlyTotal: number, monthsWithValues: number = 12): number => {
  const divisor = monthsWithValues > 0 ? monthsWithValues : 12;
  return yearlyTotal / divisor;
};

/**
 * Creates a row object with monthly values formatted for Excel
 */
export const createMonthlyValuesRow = (
  description: string,
  monthlyValues: Record<number, number>,
  indent: number = 0
): Record<string, string> => {
  const yearlyTotal = calculateYearlyTotal(monthlyValues);
  const monthlyAverage = calculateMonthlyAverage(yearlyTotal);
  
  // Add appropriate indentation based on category level
  const prefix = ' '.repeat(indent * 4);
  
  return {
    A: `${prefix}${description}`,
    B: formatNumberForExcel(monthlyValues[1] || 0),
    C: formatNumberForExcel(monthlyValues[2] || 0),
    D: formatNumberForExcel(monthlyValues[3] || 0),
    E: formatNumberForExcel(monthlyValues[4] || 0),
    F: formatNumberForExcel(monthlyValues[5] || 0),
    G: formatNumberForExcel(monthlyValues[6] || 0),
    H: formatNumberForExcel(monthlyValues[7] || 0),
    I: formatNumberForExcel(monthlyValues[8] || 0),
    J: formatNumberForExcel(monthlyValues[9] || 0),
    K: formatNumberForExcel(monthlyValues[10] || 0),
    L: formatNumberForExcel(monthlyValues[11] || 0),
    M: formatNumberForExcel(monthlyValues[12] || 0),
    N: formatNumberForExcel(yearlyTotal),
    O: formatNumberForExcel(monthlyAverage)
  };
};

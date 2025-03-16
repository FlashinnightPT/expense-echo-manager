
import { formatNumberForExcel } from "./formatters";

/**
 * Creates the header rows for the monthly report
 */
export const createReportHeaders = (year: number): Record<string, any>[] => {
  return [
    // Title and year
    { A: `${year}`, B: "", C: "", D: "", E: "", F: "", G: "Relatorio de contas Mensal", H: "" },
    // Empty row
    {},
    // Column headers
    { 
      A: "Descrição", 
      B: "Jan", 
      C: "Fev", 
      D: "Mar", 
      E: "Abr", 
      F: "Mai", 
      G: "Jun", 
      H: "Jul", 
      I: "Ago", 
      J: "Set", 
      K: "Out", 
      L: "Nov", 
      M: "Dez", 
      N: "Total acumulado do Ano", 
      O: "Média Mensal" 
    }
  ];
};

/**
 * Creates the summary section rows (income, expense, difference)
 */
export const createSummarySection = (
  incomeMonthlyTotals: Record<number, number>,
  expenseMonthlyTotals: Record<number, number>,
  incomeYearlyTotal: number,
  expenseYearlyTotal: number,
  incomeMonthlyAverage: number,
  expenseMonthlyAverage: number
): Record<string, any>[] => {
  return [
    // Income summary
    { 
      A: "Receitas", 
      B: formatNumberForExcel(incomeMonthlyTotals[1] || 0),
      C: formatNumberForExcel(incomeMonthlyTotals[2] || 0),
      D: formatNumberForExcel(incomeMonthlyTotals[3] || 0),
      E: formatNumberForExcel(incomeMonthlyTotals[4] || 0),
      F: formatNumberForExcel(incomeMonthlyTotals[5] || 0),
      G: formatNumberForExcel(incomeMonthlyTotals[6] || 0),
      H: formatNumberForExcel(incomeMonthlyTotals[7] || 0),
      I: formatNumberForExcel(incomeMonthlyTotals[8] || 0),
      J: formatNumberForExcel(incomeMonthlyTotals[9] || 0),
      K: formatNumberForExcel(incomeMonthlyTotals[10] || 0),
      L: formatNumberForExcel(incomeMonthlyTotals[11] || 0),
      M: formatNumberForExcel(incomeMonthlyTotals[12] || 0),
      N: formatNumberForExcel(incomeYearlyTotal),
      O: formatNumberForExcel(incomeMonthlyAverage),
    },
    
    // Expense summary
    {
      A: "Despesas",
      B: formatNumberForExcel(expenseMonthlyTotals[1] || 0),
      C: formatNumberForExcel(expenseMonthlyTotals[2] || 0),
      D: formatNumberForExcel(expenseMonthlyTotals[3] || 0),
      E: formatNumberForExcel(expenseMonthlyTotals[4] || 0),
      F: formatNumberForExcel(expenseMonthlyTotals[5] || 0),
      G: formatNumberForExcel(expenseMonthlyTotals[6] || 0),
      H: formatNumberForExcel(expenseMonthlyTotals[7] || 0),
      I: formatNumberForExcel(expenseMonthlyTotals[8] || 0),
      J: formatNumberForExcel(expenseMonthlyTotals[9] || 0),
      K: formatNumberForExcel(expenseMonthlyTotals[10] || 0),
      L: formatNumberForExcel(expenseMonthlyTotals[11] || 0),
      M: formatNumberForExcel(expenseMonthlyTotals[12] || 0),
      N: formatNumberForExcel(expenseYearlyTotal),
      O: formatNumberForExcel(expenseMonthlyAverage),
    },
    
    // Difference (income - expense)
    {
      A: "Diferença",
      B: formatNumberForExcel(incomeMonthlyTotals[1] - expenseMonthlyTotals[1] || 0),
      C: formatNumberForExcel(incomeMonthlyTotals[2] - expenseMonthlyTotals[2] || 0),
      D: formatNumberForExcel(incomeMonthlyTotals[3] - expenseMonthlyTotals[3] || 0),
      E: formatNumberForExcel(incomeMonthlyTotals[4] - expenseMonthlyTotals[4] || 0),
      F: formatNumberForExcel(incomeMonthlyTotals[5] - expenseMonthlyTotals[5] || 0),
      G: formatNumberForExcel(incomeMonthlyTotals[6] - expenseMonthlyTotals[6] || 0),
      H: formatNumberForExcel(incomeMonthlyTotals[7] - expenseMonthlyTotals[7] || 0),
      I: formatNumberForExcel(incomeMonthlyTotals[8] - expenseMonthlyTotals[8] || 0),
      J: formatNumberForExcel(incomeMonthlyTotals[9] - expenseMonthlyTotals[9] || 0),
      K: formatNumberForExcel(incomeMonthlyTotals[10] - expenseMonthlyTotals[10] || 0),
      L: formatNumberForExcel(incomeMonthlyTotals[11] - expenseMonthlyTotals[11] || 0),
      M: formatNumberForExcel(incomeMonthlyTotals[12] - expenseMonthlyTotals[12] || 0),
      N: formatNumberForExcel(incomeYearlyTotal - expenseYearlyTotal),
      O: formatNumberForExcel((incomeYearlyTotal - expenseYearlyTotal) / 12),
    },
    
    // Empty row
    {},
  ];
};

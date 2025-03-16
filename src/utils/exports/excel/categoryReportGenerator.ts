
import { createMonthlyValuesRow } from "./formatters";
import { TransactionCategory } from "../../mockData";
import { formatNumberForExcel } from "./formatters";

type CategoryHierarchyItem = {
  category: TransactionCategory;
  monthlyValues: Record<number, number>;
  subcategories: {
    category: TransactionCategory;
    monthlyValues: Record<number, number>;
    subcategories: {
      category: TransactionCategory;
      monthlyValues: Record<number, number>;
    }[];
  }[];
};

/**
 * Processes a category hierarchy to generate Excel rows
 */
export const processCategoryHierarchy = (
  hierarchy: CategoryHierarchyItem[],
  type: 'income' | 'expense'
): Record<string, any>[] => {
  const rows: Record<string, any>[] = [];
  
  // Add header for type
  rows.push({ 
    A: type === 'income' ? "RECEITAS" : "DESPESAS", 
    B: "", C: "", D: "", E: "", F: "", G: "", H: "", I: "", J: "", K: "", L: "", M: "", N: "", O: "" 
  });
  
  if (hierarchy.length === 0) {
    // Add empty data if no categories
    rows.push({
      A: type === 'income' ? "Receitas" : "Despesas",
      B: "0,00", C: "0,00", D: "0,00", E: "0,00", F: "0,00", G: "0,00",
      H: "0,00", I: "0,00", J: "0,00", K: "0,00", L: "0,00", M: "0,00",
      N: "0,00", O: "0,00"
    });
  } else {
    // Process each root category
    hierarchy.forEach(rootCat => {
      // Add root category row (level 1)
      rows.push(createMonthlyValuesRow(rootCat.category.name, rootCat.monthlyValues, 0));
      
      // Process level 2 categories
      rootCat.subcategories.forEach(subCat => {
        rows.push(createMonthlyValuesRow(subCat.category.name, subCat.monthlyValues, 1));
        
        // Process level 3 categories
        subCat.subcategories.forEach(level3Cat => {
          rows.push(createMonthlyValuesRow(level3Cat.category.name, level3Cat.monthlyValues, 2));
        });
      });
    });
  }
  
  // Add empty row
  rows.push({});
  
  return rows;
};

/**
 * Create total row for a category type
 */
export const createCategoryTotalRow = (
  monthlyTotals: Record<number, number>,
  yearlyTotal: number,
  monthlyAverage: number
): Record<string, any> => {
  return {
    A: "Total",
    B: formatNumberForExcel(monthlyTotals[1] || 0),
    C: formatNumberForExcel(monthlyTotals[2] || 0),
    D: formatNumberForExcel(monthlyTotals[3] || 0),
    E: formatNumberForExcel(monthlyTotals[4] || 0),
    F: formatNumberForExcel(monthlyTotals[5] || 0),
    G: formatNumberForExcel(monthlyTotals[6] || 0),
    H: formatNumberForExcel(monthlyTotals[7] || 0),
    I: formatNumberForExcel(monthlyTotals[8] || 0),
    J: formatNumberForExcel(monthlyTotals[9] || 0),
    K: formatNumberForExcel(monthlyTotals[10] || 0),
    L: formatNumberForExcel(monthlyTotals[11] || 0),
    M: formatNumberForExcel(monthlyTotals[12] || 0),
    N: formatNumberForExcel(yearlyTotal),
    O: formatNumberForExcel(monthlyAverage),
  };
};

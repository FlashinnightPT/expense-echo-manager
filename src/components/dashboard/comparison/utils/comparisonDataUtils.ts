
import { toast } from "sonner";
import { formatCurrency } from "@/utils/financialCalculations";
import { exportToExcel } from "@/utils/exportUtils";
import { getAllSubcategoryIds, validateCategoryAddition } from "./comparisonChartUtils";

export interface ComparisonItem {
  id: string;
  name: string;
  path: string;
  amount: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const calculateCategoryAmount = (
  categoryId: string,
  transactions: any[],
  categories: any[],
  startDate: Date,
  endDate: Date
): number => {
  // Get all subcategory IDs for this category
  const allCategoryIds = [categoryId, ...getAllSubcategoryIds(categoryId, categories)];
  
  // Filter transactions that belong to this category or its subcategories and are within the date range
  const categoryTransactions = transactions.filter(t => 
    allCategoryIds.includes(t.categoryId) &&
    new Date(t.date) >= startDate &&
    new Date(t.date) <= endDate
  );
  
  // Sum up the transaction amounts
  return categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
};

export const createComparisonItem = (
  categoryId: string,
  categoryPath: string,
  amount: number,
  startDate: Date,
  endDate: Date,
  customPeriod: boolean = false
): ComparisonItem => {
  const periodLabel = customPeriod
    ? ` (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`
    : '';
  
  return {
    id: `${categoryId}-${Date.now()}`,  // Use unique ID with timestamp
    name: `${categoryPath.split(" > ").pop() || "Desconhecido"}${periodLabel}`,
    path: `${categoryPath}${periodLabel}`,
    amount,
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
};

export const exportComparisonData = (
  comparisonData: ComparisonItem[], 
  startDate: Date, 
  endDate: Date
) => {
  try {
    if (comparisonData.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }
    
    const exportData = comparisonData.map(item => ({
      Categoria: item.path,
      Valor: formatCurrency(item.amount).replace(/[€$]/g, '').trim(),
      "Data Início": item.dateRange?.start.toLocaleDateString() || startDate.toLocaleDateString(),
      "Data Fim": item.dateRange?.end.toLocaleDateString() || endDate.toLocaleDateString()
    }));
    
    exportToExcel(
      exportData, 
      `comparacao_categorias_${startDate.toISOString().split('T')[0]}_a_${endDate.toISOString().split('T')[0]}`
    );
    
    toast.success("Dados de comparação exportados com sucesso");
  } catch (error) {
    console.error("Error exporting comparison data:", error);
    toast.error("Erro ao exportar dados de comparação");
  }
};

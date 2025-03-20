
import { useDataFetching } from './useDataFetching';
import { usePeriodSelection } from './usePeriodSelection';
import { useTransactionFiltering } from './useTransactionFiltering';
import { useFinancialSummaries } from './useFinancialSummaries';
import { useChartData } from './useChartData';
import { useCategoryHelpers } from './useCategoryHelpers';
import { useDataOperations } from './useDataOperations';

export const useDashboardData = () => {
  // Get the data from the fetch hook
  const { 
    transactions, 
    categories, 
    isLoading, 
    setTransactions, 
    setCategories 
  } = useDataFetching();
  
  // Handle date selection
  const { 
    selectedYear, 
    selectedMonth, 
    availableYears, 
    setSelectedYear, 
    setSelectedMonth 
  } = usePeriodSelection(transactions);
  
  // Filter transactions for the selected period
  const { filteredTransactions } = useTransactionFiltering(
    transactions, 
    selectedYear, 
    selectedMonth
  );
  
  // Generate summaries
  const { 
    monthlySummary, 
    yearlySummary 
  } = useFinancialSummaries(
    transactions, 
    filteredTransactions, 
    selectedYear
  );
  
  // Generate chart data
  const { 
    monthlyChartData, 
    yearlyChartData 
  } = useChartData(
    transactions, 
    selectedYear
  );
  
  // Get category helper functions
  const { 
    getCategoryById, 
    getCategoryPath 
  } = useCategoryHelpers(categories);
  
  // Get data operation handlers
  const { 
    handleSaveCategory, 
    handleSaveTransaction, 
    handleDeleteTransaction, 
    handleClearAllData 
  } = useDataOperations(setTransactions, setCategories);

  return {
    selectedYear,
    selectedMonth,
    transactions,
    categories,
    filteredTransactions,
    availableYears,
    monthlySummary,
    yearlySummary,
    monthlyChartData,
    yearlyChartData,
    isLoading,
    setSelectedYear,
    setSelectedMonth,
    handleSaveCategory,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleClearAllData,
    getCategoryById,
    getCategoryPath
  };
};

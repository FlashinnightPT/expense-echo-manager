
import React from "react";
import CategoryComparison from "@/components/dashboard/comparison/CategoryComparison";
import { createDateRange } from "../utils/dateUtils";

interface CategoryComparisonSectionProps {
  categories: any[];
  transactions: any[];
  selectedYear: number;
  selectedMonth: number | null;
  activeTab: "expense" | "income";
  showValues: boolean;
}

const CategoryComparisonSection = ({
  categories,
  transactions,
  selectedYear,
  selectedMonth,
  activeTab,
  showValues
}: CategoryComparisonSectionProps) => {
  // Create date range for comparison
  const { startDate, endDate } = createDateRange(selectedYear, selectedMonth);
  
  return (
    <CategoryComparison 
      categories={categories}
      transactions={transactions}
      startDate={startDate}
      endDate={endDate}
      activeTab={activeTab}
      showValues={showValues}
    />
  );
};

export default CategoryComparisonSection;

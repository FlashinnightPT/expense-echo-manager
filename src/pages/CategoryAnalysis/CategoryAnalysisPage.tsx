
import React, { useEffect, useCallback } from "react";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useTransactionData } from "@/hooks/useTransactionData";
import CategoryAnalysisFilters from "./components/CategoryAnalysisFilters";
import CategoryList from "./components/CategoryList";
import SubcategoryAnalysisTable from "./components/SubcategoryAnalysisTable";
import ShowHideValuesButton from "./components/ShowHideValuesButton";
import CategoryComparisonSection from "./components/CategoryComparisonSection";
import { useCategoryFilters } from "./hooks/useCategoryFilters";
import { useSubcategoryAnalysis } from "./hooks/useSubcategoryAnalysis";
import { getAvailableYears } from "./utils/dateUtils";
import { filterRootCategories } from "./utils/categoryUtils";

const CategoryAnalysisPage = () => {
  // Get filter states from custom hook
  const {
    activeTab,
    setActiveTab,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategoryId,
    setSelectedCategoryId,
    searchTerm,
    setSearchTerm,
    showValues,
    toggleShowValues
  } = useCategoryFilters();

  // Get category and transaction data
  const { categoryList: categories } = useCategoryData();
  const { transactionList: transactions, getFilteredTransactions } = useTransactionData();

  // Get subcategory analysis data from custom hook
  const {
    selectedCategoryName,
    subcategoryData,
    totalAmount
  } = useSubcategoryAnalysis(
    selectedCategoryId,
    selectedYear,
    selectedMonth,
    activeTab,
    categories,
    getFilteredTransactions
  );
  
  // Get available years for selection
  const availableYears = getAvailableYears(transactions);

  // If there are no years in transactions, add current year
  useEffect(() => {
    if (availableYears.length === 0) {
      const currentYear = new Date().getFullYear();
      setSelectedYear(currentYear);
    } else if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0] !== undefined ? Number(availableYears[0]) : new Date().getFullYear());
    }
  }, [availableYears, selectedYear, setSelectedYear]);

  // Filter root categories by type and search term
  const filteredRootCategories = filterRootCategories(categories, activeTab, searchTerm);

  // Clean up on unmount and prepare page for navigation
  useEffect(() => {
    console.log("CategoryAnalysisPage: Page mounted");
    
    // Helper function to allow navigation away from this page
    const prepareForNavigation = () => {
      console.log("CategoryAnalysisPage: Preparing for navigation");
      // Reset any state that might be blocking navigation
      setSelectedCategoryId("");
    };
    
    // Create and remove event listener for beforeunload
    window.addEventListener("beforeunload", prepareForNavigation);
    
    return () => {
      console.log("CategoryAnalysisPage: Component unmounting, cleaning up");
      window.removeEventListener("beforeunload", prepareForNavigation);
      // Clear the selected category and any other state that might
      // be causing navigation issues when component unmounts
      setSelectedCategoryId("");
    };
  }, [setSelectedCategoryId]);

  return (
    <main className="container mx-auto py-4" id="category-analysis-page">
      <CategoryAnalysisFilters 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        availableYears={availableYears}
      />
      
      <ShowHideValuesButton 
        showValues={showValues} 
        toggleShowValues={toggleShowValues} 
      />
      
      <CategoryList 
        filteredRootCategories={filteredRootCategories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
      />
      
      {selectedCategoryId && (
        <SubcategoryAnalysisTable 
          subcategoryData={subcategoryData}
          totalAmount={totalAmount}
          selectedCategoryName={selectedCategoryName}
          showValues={showValues}
        />
      )}
      
      <CategoryComparisonSection
        categories={categories}
        transactions={transactions}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        activeTab={activeTab}
        showValues={showValues}
      />
    </main>
  );
};

export default CategoryAnalysisPage;

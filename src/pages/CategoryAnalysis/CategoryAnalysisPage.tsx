import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useTransactionData } from "@/hooks/useTransactionData";
import CategoryAnalysisFilters from "./components/CategoryAnalysisFilters";
import CategoryList from "./components/CategoryList";
import SubcategoryAnalysisTable from "./components/SubcategoryAnalysisTable";
import CategoryComparison from "@/components/dashboard/comparison/CategoryComparison";
import ShowHideValuesButton from "./components/ShowHideValuesButton";

const CategoryAnalysisPage = () => {
  // States for filters
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for showing/hiding values
  const [showValues, setShowValues] = useState(() => {
    const savedPreference = sessionStorage.getItem("showFinancialValues");
    return savedPreference ? savedPreference === "true" : false;
  });

  // Get category and transaction data
  const { categoryList: categories } = useCategoryData();
  const { transactionList: transactions, getFilteredTransactions } = useTransactionData();

  // States for subcategories and totals
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subcategoryData, setSubcategoryData] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Dates for comparison - Fix: Create intermediate number variables to ensure type safety
  const startMonth = selectedMonth !== null ? Number(selectedMonth) : 0;
  const endMonth = selectedMonth !== null ? Number(selectedMonth) + 1 : 12;
  
  const startDate = useState(new Date(selectedYear, startMonth, 1))[0];
  const endDate = useState(new Date(selectedYear, endMonth, 0))[0];

  // Years available for selection - Fix: Ensure the array is typed as number[]
  const availableYears = Array.from(
    new Set(transactions.map(t => new Date(t.date).getFullYear()))
  ).sort((a, b) => b - a) as number[];

  // If there are no years in transactions, add current year
  useEffect(() => {
    if (availableYears.length === 0) {
      const currentYear = new Date().getFullYear();
      setSelectedYear(currentYear);
    } else if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0] !== undefined ? Number(availableYears[0]) : new Date().getFullYear());
    }
  }, [availableYears, selectedYear]);

  // Update data when filters change
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategoryData([]);
      setTotalAmount(0);
      setSelectedCategoryName("");
      return;
    }

    // Get filtered transactions
    const filteredTransactions = getFilteredTransactions(
      selectedYear,
      selectedMonth || undefined,
      activeTab
    );

    // Get the selected category
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
    if (!selectedCategory) {
      setSubcategoryData([]);
      setTotalAmount(0);
      setSelectedCategoryName("");
      return;
    }

    setSelectedCategoryName(selectedCategory.name);

    // Get subcategories
    const subcategories = categories.filter(cat => cat.parentId === selectedCategoryId);
    
    // Calculate values for each subcategory
    const subcatData = subcategories.map(subcat => {
      // Get all subcategories (including deeper levels)
      const getAllSubcats = (parentId: string): string[] => {
        const directSubcats = categories.filter(c => c.parentId === parentId);
        const ids = directSubcats.map(c => c.id);
        const nestedIds = directSubcats.flatMap(c => getAllSubcats(c.id));
        return [...ids, ...nestedIds];
      };
      
      const allSubcatIds = [subcat.id, ...getAllSubcats(subcat.id)];
      
      // Calculate the total amount for this subcategory and its subcategories
      const amount = filteredTransactions
        .filter(t => allSubcatIds.includes(t.categoryId))
        .reduce((sum, t) => sum + t.amount, 0);
        
      return {
        category: subcat,
        amount,
        percentage: 0 // Will be calculated after we have the total
      };
    });
    
    // Calculate transactions directly linked to the main category
    const directTransactions = filteredTransactions
      .filter(t => t.categoryId === selectedCategoryId)
      .reduce((sum, t) => sum + t.amount, 0);
      
    // Add the category itself if it has direct transactions
    if (directTransactions > 0) {
      subcatData.unshift({
        category: {
          ...selectedCategory,
          name: "(Diretamente nesta categoria)"
        },
        amount: directTransactions,
        percentage: 0
      });
    }
    
    // Calculate the total
    const total = subcatData.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    
    // Calculate percentages
    const dataWithPercentages = subcatData.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));
    
    setSubcategoryData(dataWithPercentages);
  }, [selectedCategoryId, selectedYear, selectedMonth, activeTab, categories, transactions, getFilteredTransactions]);

  // Filter root categories by type and search term
  const filteredRootCategories = categories
    .filter(cat => 
      cat.type === activeTab && 
      cat.level === 2 && 
      (searchTerm === "" || cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Toggle function for showing/hiding values
  const toggleShowValues = () => {
    const newValue = !showValues;
    setShowValues(newValue);
    sessionStorage.setItem("showFinancialValues", String(newValue));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-4">
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
        
        <CategoryComparison 
          categories={categories}
          transactions={transactions}
          startDate={startDate}
          endDate={endDate}
          activeTab={activeTab}
          showValues={showValues}
        />
      </main>
    </div>
  );
};

export default CategoryAnalysisPage;

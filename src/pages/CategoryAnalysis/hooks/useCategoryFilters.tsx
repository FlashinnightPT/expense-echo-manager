import { useState, useEffect } from "react";

interface CategoryFiltersProps {
  initialTab?: "expense" | "income";
  initialShowValues?: boolean;
}

export const useCategoryFilters = ({
  initialTab = "expense",
  initialShowValues = false,
}: CategoryFiltersProps = {}) => {
  // States for filters
  const [activeTab, setActiveTab] = useState<"expense" | "income">(initialTab);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for showing/hiding values
  const [showValues, setShowValues] = useState(() => {
    const savedPreference = sessionStorage.getItem("showFinancialValues");
    return savedPreference ? savedPreference === "true" : initialShowValues;
  });

  // Toggle function for showing/hiding values
  const toggleShowValues = () => {
    const newValue = !showValues;
    setShowValues(newValue);
    sessionStorage.setItem("showFinancialValues", String(newValue));
  };

  // Update state when session storage changes (to keep in sync across pages)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedPreference = sessionStorage.getItem("showFinancialValues");
      if (savedPreference) {
        setShowValues(savedPreference === "true");
      }
    };

    // Check for updates when component mounts
    handleStorageChange();

    // Listen for storage events (this will catch changes from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    // Filter states
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
    
    // Value visibility
    showValues,
    toggleShowValues
  };
};

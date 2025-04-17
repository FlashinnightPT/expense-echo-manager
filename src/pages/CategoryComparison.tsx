
import React from "react";
import CategoryComparisonPage from "./CategoryComparison/CategoryComparisonPage";

// Use a more specific component name to avoid namespace conflicts
const CategoryComparisonPageWrapper = () => {
  // Simple component wrapper - no navigation interference
  return <CategoryComparisonPage />;
};

export default CategoryComparisonPageWrapper;

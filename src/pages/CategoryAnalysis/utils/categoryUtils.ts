
import { TransactionCategory } from "@/utils/mockData";

/**
 * Filters root categories by type and search term
 */
export const filterRootCategories = (
  categories: TransactionCategory[],
  activeTab: "expense" | "income",
  searchTerm: string
) => {
  return categories
    .filter(cat => 
      cat.type === activeTab && 
      cat.level === 2 && 
      (searchTerm === "" || cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

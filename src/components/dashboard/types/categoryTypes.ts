
import { Transaction, TransactionCategory } from "@/utils/mockData";

export interface CategoryTransactionsTableProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
  selectedYear: number;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
  getCategoryById: (id: string) => TransactionCategory | undefined;
}

// Define interfaces for our hierarchical data structure
export interface CategoryItem {
  category: TransactionCategory;
  amount: number;
}

export interface Level4Item extends CategoryItem {
  // No additional properties needed
}

export interface Level3Item extends CategoryItem {
  subcategories: Level4Item[];
}

export interface Level2Item extends CategoryItem {
  subcategories: Level3Item[];
}

export interface RootCategoryItem extends CategoryItem {
  subcategories: Level2Item[];
}

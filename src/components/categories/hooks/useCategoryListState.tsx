
import { useState } from "react";
import { TransactionCategory } from "@/utils/mockData";

export function useCategoryListState() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const openEditDialog = (category: TransactionCategory) => {
    setEditingCategory(category);
    setEditDialogOpen(true);
  };

  return {
    expandedCategories,
    editingCategory,
    editDialogOpen,
    setEditDialogOpen,
    toggleCategoryExpansion,
    openEditDialog
  };
}

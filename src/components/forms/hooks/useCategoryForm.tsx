import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";

interface UseCategoryFormProps {
  onSave: (category: Partial<TransactionCategory>) => void;
  categoryList: TransactionCategory[];
}

export const useCategoryForm = ({ onSave, categoryList }: UseCategoryFormProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [level, setLevel] = useState(2);
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState("");
  const [parentPath, setParentPath] = useState<TransactionCategory[]>([]);
  
  // Reset form fields when changing type
  useEffect(() => {
    console.log("Resetting form for type:", type);
    setParentId("");
    setParentPath([]);
    setLevel(2);
    setCategoryName("");
  }, [type]);
  
  // Reset form when category list changes (e.g., on import)
  useEffect(() => {
    console.log("Category list changed, resetting form");
    setParentId("");
    setParentPath([]);
    setLevel(2);
    setCategoryName("");
  }, [categoryList]);
  
  const handleSubmit = () => {
    if (!categoryName.trim()) {
      toast.error("Por favor, insira um nome para a categoria");
      return;
    }
    
    let newCategory: Partial<TransactionCategory> = {
      name: categoryName,
      type: type,
      level: level,
    };
    
    if (level > 2) {
      if (!parentId) {
        toast.error(`Selecione uma categoria pai`);
        return;
      }
      newCategory.parentId = parentId;
    }
    
    console.log("Submitting new category:", newCategory);
    onSave(newCategory);
    
    // Keep the same parent and type, just reset the name to allow quick adding of multiple items
    setCategoryName("");
    
    toast.success(`${getCategoryLevelName(level)} "${categoryName}" adicionado com sucesso`);
  };
  
  const getCategoryLevelName = (level: number): string => {
    switch (level) {
      case 2: return "Categoria";
      case 3: return "Subcategoria";
      case 4: return "Item";
      default: return "Categoria";
    }
  };
  
  const selectCategory = (category: TransactionCategory) => {
    setParentId(category.id);
    
    // Update level based on the selected category
    setLevel(category.level + 1);
    
    // Create the path to this category
    const path: TransactionCategory[] = [];
    
    // Add the current category to path
    path.push(category);
    
    // Find parents recursively and add to path
    let currentParentId = category.parentId;
    while (currentParentId) {
      const parent = categoryList.find(c => c.id === currentParentId);
      if (parent) {
        path.unshift(parent); // Add to beginning of array
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }
    
    setParentPath(path);
  };
  
  const clearSelection = () => {
    setParentId("");
    setParentPath([]);
    setLevel(2);
  };

  // Function to get all direct children of a category
  const getCategoryChildren = (parentCatId: string | null) => {
    return categoryList.filter(cat => {
      // For top level (null parent), show only level 2 categories of the selected type
      if (parentCatId === null) {
        return cat.level === 2 && cat.type === type;
      }
      // For other levels, show direct children
      return cat.parentId === parentCatId;
    });
  };
  
  // Get available categories at current selection level
  const getAvailableCategories = () => {
    if (parentPath.length === 0) {
      // Top level - show level 2 categories
      return getCategoryChildren(null);
    } else {
      // Show children of the last item in the path
      const lastPathItem = parentPath[parentPath.length - 1];
      return getCategoryChildren(lastPathItem.id);
    }
  };

  return {
    type,
    setType,
    level,
    categoryName,
    setCategoryName,
    parentId,
    parentPath,
    handleSubmit,
    selectCategory,
    clearSelection,
    getAvailableCategories,
    getCategoryLevelName
  };
};

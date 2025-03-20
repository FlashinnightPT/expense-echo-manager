import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { defaultCategories } from "@/utils/defaultCategories";
import { toast } from "sonner";
import { ExtendedTransactionCategory } from "@/components/dashboard/types/categoryTypes";
import { categoryService } from "@/services/api/category/CategoryService";

export const useCategoryData = () => {
  const initCategories = () => {
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories) {
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    
    try {
      const parsedCategories = JSON.parse(storedCategories);
      console.log("Loaded categories from localStorage:", parsedCategories);
      return parsedCategories;
    } catch (error) {
      console.error("Error parsing categories from localStorage:", error);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
  };

  const [categoryList, setCategoryList] = useState<TransactionCategory[]>(initCategories());

  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categoryList));
      console.log("Categories saved to localStorage:", categoryList);
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
      toast.error("Erro ao salvar categorias");
    }
  }, [categoryList]);

  const handleSaveCategory = (category: Partial<TransactionCategory>) => {
    try {
      if (!category.name || !category.type || !category.level) {
        toast.error("Dados de categoria incompletos");
        return;
      }

      const newCategory: TransactionCategory = {
        id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: category.name,
        type: category.type,
        level: category.level,
        ...(category.parentId && { parentId: category.parentId })
      };

      console.log("Adding new category:", newCategory);
      
      const updatedList = [...categoryList, newCategory];
      setCategoryList(updatedList);
      
      console.log("Categoria adicionada:", newCategory);
      console.log("Nova lista de categorias:", updatedList);
      
      toast.success(`Categoria "${newCategory.name}" adicionada com sucesso`);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Erro ao adicionar categoria");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const hasChildren = categoryList.some(cat => cat.parentId === categoryId);
    
    if (hasChildren) {
      toast.error("Não é possível apagar uma categoria que tem subcategorias. Apague as subcategorias primeiro.");
      return false;
    }
    
    return true;
  };

  const confirmDeleteCategory = (categoryId: string) => {
    const updatedList = categoryList.filter(cat => cat.id !== categoryId);
    setCategoryList(updatedList);
    toast.success("Categoria apagada com sucesso");
    return true;
  };

  const updateCategoryName = (categoryId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("O nome da categoria não pode estar vazio");
      return false;
    }

    const updatedList = categoryList.map(cat => 
      cat.id === categoryId ? { ...cat, name: newName } : cat
    );
    
    setCategoryList(updatedList);
    toast.success("Nome de categoria atualizado com sucesso");
    return true;
  };

  const updateFixedExpense = (categoryId: string, isFixedExpense: boolean) => {
    const updatedList = categoryList.map(cat => 
      cat.id === categoryId ? { ...cat, isFixedExpense } : cat
    );
    
    setCategoryList(updatedList);
    toast.success(`Categoria ${isFixedExpense ? 'marcada' : 'desmarcada'} como despesa fixa`);
    return true;
  };

  const moveCategory = (categoryId: string, newParentId: string | null) => {
    // Prevent moving to own child (would create circular reference)
    if (newParentId) {
      // Find all descendants of the category to move
      const findAllDescendants = (catId: string): string[] => {
        const children = categoryList.filter(c => c.parentId === catId).map(c => c.id);
        return [
          ...children,
          ...children.flatMap(childId => findAllDescendants(childId))
        ];
      };
      
      const descendants = findAllDescendants(categoryId);
      if (descendants.includes(newParentId)) {
        toast.error("Não é possível mover uma categoria para uma das suas subcategorias");
        return false;
      }
    }

    // Get current category to determine new level
    const categoryToMove = categoryList.find(cat => cat.id === categoryId);
    if (!categoryToMove) return false;

    // Get new parent to calculate new level
    const newParent = newParentId ? categoryList.find(cat => cat.id === newParentId) : null;
    const newLevel = newParent ? newParent.level + 1 : 1; // Level 1 if no parent

    // Update the category and all its descendants
    const updateCategoryAndDescendants = (cat: TransactionCategory, levelDiff: number): TransactionCategory => {
      // If this is the category being moved, update its parentId and level
      if (cat.id === categoryId) {
        return {
          ...cat,
          parentId: newParentId || undefined,
          level: newLevel
        };
      }
      
      // For descendants, just update their level
      const isDescendant = (cId: string): boolean => {
        const parent = categoryList.find(c => c.id === cId)?.parentId;
        if (!parent) return false;
        if (parent === categoryId) return true;
        return isDescendant(parent);
      };

      if (isDescendant(cat.id)) {
        return {
          ...cat,
          level: cat.level + levelDiff
        };
      }

      return cat;
    };

    // Calculate level difference for updating descendants
    const levelDiff = newLevel - categoryToMove.level;

    const updatedList = categoryList.map(cat => updateCategoryAndDescendants(cat, levelDiff));
    setCategoryList(updatedList);
    
    toast.success("Categoria movida com sucesso");
    return true;
  };

  const clearNonRootCategories = async () => {
    try {
      const rootCategories = await categoryService.clearNonRootCategories(categoryList);
      setCategoryList(rootCategories);
      return true;
    } catch (error) {
      console.error("Erro ao limpar categorias:", error);
      toast.error("Erro ao limpar categorias");
      return false;
    }
  };

  return {
    categoryList,
    handleSaveCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    updateCategoryName,
    moveCategory,
    updateFixedExpense,
    clearNonRootCategories
  };
};

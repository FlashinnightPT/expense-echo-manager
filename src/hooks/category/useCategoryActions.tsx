
import { useState } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

interface UseCategoryActionsProps {
  categoryList: TransactionCategory[];
  setCategoryList: React.Dispatch<React.SetStateAction<TransactionCategory[]>>;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Hook containing actions for manipulating categories
 */
export const useCategoryActions = ({ 
  categoryList, 
  setCategoryList, 
  setIsLoading 
}: UseCategoryActionsProps) => {

  const handleSaveCategory = async (category: Partial<TransactionCategory>) => {
    try {
      if (!category.name || !category.type || !category.level) {
        toast.error("Dados de categoria incompletos");
        return;
      }

      // Default to active for new categories and ensure all fields have values
      const categoryToSave = {
        ...category,
        isActive: category.isActive !== false,
        isFixedExpense: Boolean(category.isFixedExpense),
      };

      console.log("Saving category with data:", categoryToSave);
      setIsLoading(true);
      
      // Save category to API
      const savedCategory = await categoryService.saveCategory(categoryToSave);
      
      console.log("Categoria salva na API:", savedCategory);
      
      // Verify we have a valid saved category with required fields
      if (savedCategory && savedCategory.id && savedCategory.name) {
        // Update local list with category returned from API
        setCategoryList(prevList => {
          // Check if category exists in the list and replace it
          const exists = prevList.some(cat => cat.id === savedCategory.id);
          if (exists) {
            return prevList.map(cat => cat.id === savedCategory.id ? savedCategory : cat);
          }
          // Otherwise add it as new
          return [...prevList, savedCategory];
        });
        
        console.log("Categoria adicionada:", savedCategory);
        
        toast.success(`Categoria "${savedCategory.name}" adicionada com sucesso`);
        return savedCategory;
      } else {
        console.error("Invalid saved category data:", savedCategory);
        toast.error("Erro ao adicionar categoria: dados inválidos");
        return null;
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Erro ao adicionar categoria");
      return null;
    } finally {
      setIsLoading(false);
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

  const confirmDeleteCategory = async (categoryId: string) => {
    try {
      setIsLoading(true);
      // Delete from API
      const success = await categoryService.deleteCategory(categoryId);
      
      if (success) {
        // Update local list only if deletion in API was successful
        setCategoryList(prevList => prevList.filter(cat => cat.id !== categoryId));
        toast.success("Categoria apagada com sucesso");
        return true;
      } else {
        toast.error("Erro ao apagar categoria no banco de dados");
        return false;
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao apagar categoria");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearNonRootCategories = async () => {
    try {
      setIsLoading(true);
      const rootCategories = await categoryService.clearNonRootCategories(categoryList);
      setCategoryList(rootCategories);
      return true;
    } catch (error) {
      console.error("Erro ao limpar categorias:", error);
      toast.error("Erro ao limpar categorias");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSaveCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    clearNonRootCategories
  };
};

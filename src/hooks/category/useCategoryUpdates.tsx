
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

interface UseCategoryUpdatesProps {
  categoryList: TransactionCategory[];
  setCategoryList: React.Dispatch<React.SetStateAction<TransactionCategory[]>>;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Hook containing methods for updating existing categories
 */
export const useCategoryUpdates = ({ 
  categoryList, 
  setCategoryList, 
  setIsLoading 
}: UseCategoryUpdatesProps) => {
  
  // Update category name
  const updateCategoryName = async (categoryId: string, newName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Find the category
      const category = categoryList.find(cat => cat.id === categoryId);
      if (!category) {
        toast.error("Categoria não encontrada");
        return false;
      }
      
      // Create updated category
      const updatedCategory: TransactionCategory = {
        ...category,
        name: newName
      };
      
      // Save to Supabase first
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      // Update local list
      setCategoryList(prevList => {
        return prevList.map(cat => {
          if (cat.id === categoryId) {
            return savedCategory;
          }
          return cat;
        });
      });
      
      toast.success("Nome da categoria atualizado");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar nome de categoria:", error);
      toast.error("Erro ao atualizar nome da categoria");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle category active state
  const updateCategoryActive = async (categoryId: string, isActive: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Find the category
      const category = categoryList.find(cat => cat.id === categoryId);
      if (!category) {
        toast.error("Categoria não encontrada");
        return false;
      }
      
      // FIX: Explicitly set boolean value using strict comparison
      // This ensures it's truly a boolean true/false, not just truthy/falsy
      const activeState = isActive === true ? true : false;
      
      console.log("UPDATING CATEGORY ACTIVE STATE - BEFORE:", {
        categoryId, 
        currentIsActive: category.isActive,
        currentIsActive_type: typeof category.isActive,
        newIsActive: activeState,
        newIsActive_type: typeof activeState
      });
      
      // Create updated category with an explicit boolean
      const updatedCategory: TransactionCategory = {
        ...category,
        isActive: activeState // Force boolean
      };
      
      console.log("UPDATED CATEGORY OBJECT - SENDING TO SERVER:", updatedCategory);
      
      // Save to Supabase first
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      console.log("SAVED CATEGORY FROM SERVER - AFTER UPDATE:", {
        savedCategory,
        isActive: savedCategory.isActive,
        isActive_type: typeof savedCategory.isActive
      });
      
      // Update local list
      setCategoryList(prevList => {
        return prevList.map(cat => {
          if (cat.id === categoryId) {
            return savedCategory;
          }
          return cat;
        });
      });
      
      toast.success(activeState 
        ? "Categoria ativada com sucesso" 
        : "Categoria desativada com sucesso");
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar estado ativo de categoria:", error);
      toast.error("Erro ao atualizar estado da categoria");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update fixed expense state
  const updateFixedExpense = async (categoryId: string, isFixedExpense: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Find the category
      const category = categoryList.find(cat => cat.id === categoryId);
      if (!category) {
        toast.error("Categoria não encontrada");
        return false;
      }
      
      // FIX: Explicitly set boolean value using strict comparison
      const fixedExpenseState = isFixedExpense === true ? true : false;
      
      console.log("UPDATING FIXED EXPENSE STATE - BEFORE:", {
        categoryId, 
        currentIsFixedExpense: category.isFixedExpense,
        currentIsFixedExpense_type: typeof category.isFixedExpense,
        newIsFixedExpense: fixedExpenseState,
        newIsFixedExpense_type: typeof fixedExpenseState
      });
      
      // Create updated category with an explicit boolean
      const updatedCategory: TransactionCategory = {
        ...category,
        isFixedExpense: fixedExpenseState // Force boolean
      };
      
      console.log("UPDATED CATEGORY OBJECT - SENDING TO SERVER:", updatedCategory);
      
      // Save to Supabase first
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      console.log("SAVED CATEGORY FROM SERVER - AFTER UPDATE:", {
        savedCategory,
        isFixedExpense: savedCategory.isFixedExpense,
        isFixedExpense_type: typeof savedCategory.isFixedExpense
      });
      
      // Update local list
      setCategoryList(prevList => {
        return prevList.map(cat => {
          if (cat.id === categoryId) {
            return savedCategory;
          }
          return cat;
        });
      });
      
      toast.success(fixedExpenseState 
        ? "Despesa fixa marcada com sucesso" 
        : "Despesa fixa desmarcada com sucesso");
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar estado de despesa fixa:", error);
      toast.error("Erro ao atualizar estado de despesa fixa");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateCategoryName,
    updateCategoryActive,
    updateFixedExpense
  };
};

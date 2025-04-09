
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

interface UseCategoryUpdatesProps {
  categoryList: TransactionCategory[];
  setCategoryList: React.Dispatch<React.SetStateAction<TransactionCategory[]>>;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Hook with methods for updating existing categories
 */
export const useCategoryUpdates = ({
  categoryList,
  setCategoryList,
  setIsLoading
}: UseCategoryUpdatesProps) => {
  
  const updateCategoryName = async (categoryId: string, newName: string, isActive?: boolean) => {
    try {
      setIsLoading(true);
      
      // Find the category to update
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      
      if (!categoryToUpdate) {
        toast.error("Category not found");
        return false;
      }
      
      // Create updated category object
      const updatedCategory: Partial<TransactionCategory> = {
        ...categoryToUpdate,
        name: newName
      };
      
      // If isActive is provided, update it
      if (isActive !== undefined) {
        updatedCategory.isActive = isActive;
      }
      
      // Update via the category service instead of direct API call
      await categoryService.saveCategory(updatedCategory);
      
      // Update local state with explicit type
      setCategoryList((prev: TransactionCategory[]) => 
        prev.map(cat => cat.id === categoryId ? 
          { ...cat, name: newName, ...(isActive !== undefined && { isActive }) } : 
          cat
        )
      );
      
      toast.success("Category updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating category name:", error);
      toast.error("Error updating category");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategoryActive = async (categoryId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      
      // Find the category to update
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      
      if (!categoryToUpdate) {
        toast.error("Category not found");
        return false;
      }
      
      // Create updated category object
      const updatedCategory: Partial<TransactionCategory> = {
        ...categoryToUpdate,
        isActive
      };
      
      // Update via the category service
      await categoryService.saveCategory(updatedCategory);
      
      // Update local state with explicit type
      setCategoryList((prev: TransactionCategory[]) => 
        prev.map(cat => cat.id === categoryId ? { ...cat, isActive } : cat)
      );
      
      toast.success("Category status updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating category active status:", error);
      toast.error("Error updating category status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFixedExpense = async (categoryId: string, isFixedExpense: boolean) => {
    try {
      setIsLoading(true);
      
      // Find the category to update
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      
      if (!categoryToUpdate) {
        toast.error("Category not found");
        return false;
      }
      
      // Create updated category object
      const updatedCategory: Partial<TransactionCategory> = {
        ...categoryToUpdate,
        isFixedExpense
      };
      
      // Update via the category service
      await categoryService.saveCategory(updatedCategory);
      
      // Update local state with explicit type
      setCategoryList((prev: TransactionCategory[]) => 
        prev.map(cat => cat.id === categoryId ? { ...cat, isFixedExpense } : cat)
      );
      
      toast.success("Fixed expense status updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating fixed expense status:", error);
      toast.error("Error updating fixed expense status");
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

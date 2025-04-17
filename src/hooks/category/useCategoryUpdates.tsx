
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
  
  const updateCategoryName = async (categoryId: string, newName: string, isFixedExpense?: boolean, isActive?: boolean) => {
    try {
      setIsLoading(true);
      
      // Find the category to update
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      
      if (!categoryToUpdate) {
        toast.error("Category not found");
        return false;
      }
      
      // Create updated category object with all properties that need updating
      const updatedCategory: Partial<TransactionCategory> = {
        ...categoryToUpdate,
        name: newName
      };
      
      // Only update these properties if they were explicitly provided
      if (isFixedExpense !== undefined) {
        updatedCategory.isFixedExpense = isFixedExpense;
      }
      
      if (isActive !== undefined) {
        updatedCategory.isActive = isActive;
      }
      
      console.log("Updating category with data:", {
        id: updatedCategory.id,
        name: updatedCategory.name,
        isFixedExpense: updatedCategory.isFixedExpense,
        isActive: updatedCategory.isActive,
        "isActive type": typeof updatedCategory.isActive,
        "isFixedExpense type": typeof updatedCategory.isFixedExpense
      });
      
      // Make a single API call with all updated properties
      await categoryService.saveCategory(updatedCategory);
      
      // Update local state with all properties that were updated
      setCategoryList((prev: TransactionCategory[]) => 
        prev.map(cat => {
          if (cat.id === categoryId) {
            const updatedCat = { ...cat, name: newName };
            
            if (isFixedExpense !== undefined) {
              updatedCat.isFixedExpense = isFixedExpense;
            }
            
            if (isActive !== undefined) {
              updatedCat.isActive = isActive;
            }
            
            return updatedCat;
          }
          return cat;
        })
      );
      
      toast.success("Category updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // These methods are kept for backward compatibility, but internally they'll use updateCategoryName
  const updateCategoryActive = async (categoryId: string, isActive: boolean) => {
    try {
      setIsLoading(true);
      
      // Find the category to update
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      
      if (!categoryToUpdate) {
        toast.error("Category not found");
        return false;
      }
      
      console.log("Updating category active status with value:", isActive, "type:", typeof isActive);
      
      // Use the unified update method
      return await updateCategoryName(categoryId, categoryToUpdate.name, undefined, isActive);
      
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
      
      // Use the unified update method
      return await updateCategoryName(categoryId, categoryToUpdate.name, isFixedExpense, undefined);
      
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

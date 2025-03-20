
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

interface UseCategoryTreeProps {
  categoryList: TransactionCategory[];
  setCategoryList: React.Dispatch<React.SetStateAction<TransactionCategory[]>>;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Hook for handling category tree operations
 */
export const useCategoryTree = ({
  categoryList,
  setCategoryList,
  setIsLoading
}: UseCategoryTreeProps) => {

  const moveCategory = async (categoryId: string, newParentId: string | null) => {
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

    try {
      setIsLoading(true);
      
      // Get current category to determine new level
      const categoryToMove = categoryList.find(cat => cat.id === categoryId);
      if (!categoryToMove) return false;

      // Get new parent to calculate new level
      const newParent = newParentId ? categoryList.find(cat => cat.id === newParentId) : null;
      const newLevel = newParent ? newParent.level + 1 : 1; // Level 1 if no parent

      // Create updated object for the moved category
      const updatedCategory = {
        ...categoryToMove,
        parentId: newParentId || undefined,
        level: newLevel
      };
      
      // Update in Supabase
      await categoryService.saveCategory(updatedCategory);
      
      // Calculate level difference for descendants
      const levelDiff = newLevel - categoryToMove.level;
      
      // Update the category and all its descendants
      const updateCategoryAndDescendants = async () => {
        // First, update the main category
        const updatedList = categoryList.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              parentId: newParentId || undefined,
              level: newLevel
            };
          }

          // Check if it's a descendant
          const isDescendant = (cId: string): boolean => {
            const parent = categoryList.find(c => c.id === cId)?.parentId;
            if (!parent) return false;
            if (parent === categoryId) return true;
            return isDescendant(parent);
          };

          // Update level of descendants
          if (isDescendant(cat.id)) {
            const updatedDescendant = {
              ...cat,
              level: cat.level + levelDiff
            };
            
            // Update in Supabase as well
            categoryService.saveCategory(updatedDescendant).catch(error => {
              console.error("Erro ao atualizar descendente:", error);
            });
            
            return updatedDescendant;
          }

          return cat;
        });

        setCategoryList(updatedList);
      };
      
      await updateCategoryAndDescendants();
      
      toast.success("Categoria movida com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao mover categoria:", error);
      toast.error("Erro ao mover categoria");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    moveCategory
  };
};

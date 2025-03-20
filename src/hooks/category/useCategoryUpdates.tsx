
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

  const updateCategoryName = async (categoryId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("O nome da categoria não pode estar vazio");
      return false;
    }

    try {
      setIsLoading(true);
      
      // Find the category to update
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      if (!categoryToUpdate) return false;
      
      // Create updated object
      const updatedCategory = { ...categoryToUpdate, name: newName };
      
      // Update in Supabase
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      // Update the local list
      setCategoryList(prevList => 
        prevList.map(cat => cat.id === categoryId ? savedCategory : cat)
      );
      
      toast.success("Nome de categoria atualizado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria");
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
      if (!categoryToUpdate) return false;
      
      console.log("Atualizando estado ativo da categoria:", {
        antes: categoryToUpdate,
        novo_estado: isActive
      });
      
      // Create updated object with the new isActive state
      const updatedCategory = { 
        ...categoryToUpdate, 
        isActive: isActive // Garantir que o valor booleano é passado corretamente
      };
      
      console.log("Categoria a enviar para Supabase:", updatedCategory);
      
      // Update in Supabase
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      console.log("Resposta do Supabase após salvar:", savedCategory);
      
      // Update the local list with the response from Supabase
      setCategoryList(prevList => 
        prevList.map(cat => cat.id === categoryId ? savedCategory : cat)
      );
      
      toast.success(`Categoria ${isActive ? 'ativada' : 'desativada'} com sucesso`);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status da categoria:", error);
      toast.error("Erro ao atualizar status da categoria");
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
      if (!categoryToUpdate) return false;
      
      console.log("Atualizando despesa fixa da categoria:", {
        antes: categoryToUpdate,
        novo_estado: isFixedExpense
      });
      
      // Create updated object with explicit boolean value
      const updatedCategory = { 
        ...categoryToUpdate, 
        isFixedExpense: isFixedExpense // Garantir que o valor booleano é passado corretamente
      };
      
      console.log("Categoria com despesa fixa atualizada a enviar:", updatedCategory);
      
      // Update in Supabase
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      console.log("Resposta do Supabase após salvar despesa fixa:", savedCategory);
      
      // Update the local list
      setCategoryList(prevList => 
        prevList.map(cat => cat.id === categoryId ? savedCategory : cat)
      );
      
      toast.success(`Categoria ${isFixedExpense ? 'marcada' : 'desmarcada'} como despesa fixa`);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria");
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

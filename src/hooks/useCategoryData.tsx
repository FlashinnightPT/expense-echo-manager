
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
  const [isLoading, setIsLoading] = useState(false);

  // Carrega categorias do Supabase ao iniciar
  useEffect(() => {
    const loadCategoriesFromSupabase = async () => {
      try {
        setIsLoading(true);
        const supabaseCategories = await categoryService.getCategories();
        if (supabaseCategories && supabaseCategories.length > 0) {
          console.log("Categorias carregadas do Supabase:", supabaseCategories);
          setCategoryList(supabaseCategories);
          localStorage.setItem('categories', JSON.stringify(supabaseCategories));
        } else {
          // Se não houver categorias no Supabase, sincronizamos as locais
          console.log("Nenhuma categoria encontrada no Supabase, sincronizando categorias locais...");
          const localCategories = initCategories();
          
          // Sincroniza categorias locais com Supabase
          for (const category of localCategories) {
            await categoryService.saveCategory(category);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar categorias do Supabase:", error);
        toast.error("Erro ao buscar categorias do banco de dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoriesFromSupabase();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categoryList));
      console.log("Categories saved to localStorage:", categoryList);
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
      toast.error("Erro ao salvar categorias");
    }
  }, [categoryList]);

  const handleSaveCategory = async (category: Partial<TransactionCategory>) => {
    try {
      if (!category.name || !category.type || !category.level) {
        toast.error("Dados de categoria incompletos");
        return;
      }

      // Default to active for new categories
      const categoryToSave = {
        ...category,
        isActive: category.isActive !== false
      };

      setIsLoading(true);
      
      // Salva categoria no Supabase primeiro
      const savedCategory = await categoryService.saveCategory(categoryToSave);
      
      console.log("Categoria salva no Supabase:", savedCategory);
      
      // Atualiza a lista local com a categoria retornada do Supabase
      const updatedList = [...categoryList, savedCategory];
      setCategoryList(updatedList);
      
      console.log("Categoria adicionada:", savedCategory);
      console.log("Nova lista de categorias:", updatedList);
      
      toast.success(`Categoria "${savedCategory.name}" adicionada com sucesso`);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      toast.error("Erro ao adicionar categoria");
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
      // Exclui do Supabase
      const success = await categoryService.deleteCategory(categoryId);
      
      if (success) {
        // Atualiza lista local apenas se a exclusão no Supabase for bem-sucedida
        const updatedList = categoryList.filter(cat => cat.id !== categoryId);
        setCategoryList(updatedList);
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

  const updateCategoryName = async (categoryId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("O nome da categoria não pode estar vazio");
      return false;
    }

    try {
      setIsLoading(true);
      
      // Encontra a categoria para atualizar
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      if (!categoryToUpdate) return false;
      
      // Cria objeto atualizado
      const updatedCategory = { ...categoryToUpdate, name: newName };
      
      // Atualiza no Supabase
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      // Atualiza a lista local
      const updatedList = categoryList.map(cat => 
        cat.id === categoryId ? savedCategory : cat
      );
      
      setCategoryList(updatedList);
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
      
      // Encontra a categoria para atualizar
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      if (!categoryToUpdate) return false;
      
      // Cria objeto atualizado
      const updatedCategory = { ...categoryToUpdate, isActive };
      
      // Atualiza no Supabase
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      // Atualiza a lista local
      const updatedList = categoryList.map(cat => 
        cat.id === categoryId ? { ...savedCategory, isActive } : cat
      );
      
      setCategoryList(updatedList);
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
      
      // Encontra a categoria para atualizar
      const categoryToUpdate = categoryList.find(cat => cat.id === categoryId);
      if (!categoryToUpdate) return false;
      
      // Cria objeto atualizado
      const updatedCategory = { ...categoryToUpdate, isFixedExpense };
      
      // Atualiza no Supabase
      const savedCategory = await categoryService.saveCategory(updatedCategory);
      
      // Atualiza a lista local
      const updatedList = categoryList.map(cat => 
        cat.id === categoryId ? { ...savedCategory, isFixedExpense } : cat
      );
      
      setCategoryList(updatedList);
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

      // Cria objeto atualizado para a categoria movida
      const updatedCategory = {
        ...categoryToMove,
        parentId: newParentId || undefined,
        level: newLevel
      };
      
      // Atualiza no Supabase
      await categoryService.saveCategory(updatedCategory);
      
      // Calcula a diferença de nível para os descendentes
      const levelDiff = newLevel - categoryToMove.level;
      
      // Atualiza a categoria e todos os seus descendentes
      const updateCategoryAndDescendants = async () => {
        // Primeiro, atualiza a categoria principal
        const updatedList = categoryList.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              parentId: newParentId || undefined,
              level: newLevel
            };
          }

          // Verifica se é um descendente
          const isDescendant = (cId: string): boolean => {
            const parent = categoryList.find(c => c.id === cId)?.parentId;
            if (!parent) return false;
            if (parent === categoryId) return true;
            return isDescendant(parent);
          };

          // Atualiza o nível dos descendentes
          if (isDescendant(cat.id)) {
            const updatedDescendant = {
              ...cat,
              level: cat.level + levelDiff
            };
            
            // Atualiza no Supabase também
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
    categoryList,
    isLoading,
    handleSaveCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
    updateCategoryName,
    moveCategory,
    updateFixedExpense,
    updateCategoryActive,
    clearNonRootCategories
  };
};


import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { defaultCategories } from "@/utils/defaultCategories";
import { toast } from "sonner";

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

  const handleImportCategories = (categories: Partial<TransactionCategory>[]) => {
    try {
      if (!categories || categories.length === 0) {
        toast.warning("Nenhuma categoria para importar");
        return;
      }

      const newCategories: TransactionCategory[] = [];
      
      // First import level 2 categories
      const level2Categories = categories.filter(cat => cat.level === 2);
      const level2Map = new Map<string, string>(); // name -> id
      
      level2Categories.forEach(category => {
        if (category.name && category.type && category.level) {
          const newCategory: TransactionCategory = {
            id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: category.name,
            type: category.type,
            level: category.level
          };
          
          newCategories.push(newCategory);
          level2Map.set(category.name, newCategory.id);
        }
      });
      
      // Then import level 3 categories
      const level3Categories = categories.filter(cat => cat.level === 3);
      const level3Map = new Map<string, string>(); // name -> id
      
      level3Categories.forEach(category => {
        if (category.name && category.type && category.level) {
          // Find the correct parent ID from our new map
          let parentId = category.parentId;
          
          // If this was from Excel import, the parent ID might not be set yet
          if (!parentId && category.parentName) {
            parentId = level2Map.get(category.parentName);
          }
          
          if (!parentId) {
            console.warn(`Could not find parent for level 3 category ${category.name}`);
            return;
          }
          
          const newCategory: TransactionCategory = {
            id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: category.name,
            type: category.type,
            level: category.level,
            parentId
          };
          
          newCategories.push(newCategory);
          level3Map.set(category.name, newCategory.id);
        }
      });
      
      // Finally import level 4 categories
      const level4Categories = categories.filter(cat => cat.level === 4);
      
      level4Categories.forEach(category => {
        if (category.name && category.type && category.level) {
          // Find the correct parent ID from our new map
          let parentId = category.parentId;
          
          // If this was from Excel import, the parent ID might not be set yet
          if (!parentId && category.parentName) {
            parentId = level3Map.get(category.parentName);
          }
          
          if (!parentId) {
            console.warn(`Could not find parent for level 4 category ${category.name}`);
            return;
          }
          
          const newCategory: TransactionCategory = {
            id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: category.name,
            type: category.type,
            level: category.level,
            parentId
          };
          
          newCategories.push(newCategory);
        }
      });
      
      const updatedList = [...categoryList, ...newCategories];
      setCategoryList(updatedList);
      
      console.log(`${newCategories.length} categorias importadas`);
      console.log("Nova lista de categorias:", updatedList);
      
      return newCategories.length;
    } catch (error) {
      console.error("Error importing categories:", error);
      toast.error("Erro ao importar categorias");
      throw error;
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

  const handleResetCategories = () => {
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
    setCategoryList(defaultCategories);
    toast.success("Categorias reiniciadas para o padrão");
  };

  return {
    categoryList,
    handleSaveCategory,
    handleImportCategories,
    handleDeleteCategory,
    confirmDeleteCategory,
    handleResetCategories
  };
};


import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { defaultCategories } from "@/utils/defaultCategories";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

/**
 * Core hook for managing category data state and loading
 */
export const useCategoriesCore = () => {
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

  // Load categories from Supabase on init
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
          // If no categories in Supabase, sync local ones
          console.log("Nenhuma categoria encontrada no Supabase, sincronizando categorias locais...");
          const localCategories = initCategories();
          
          // Sync local categories with Supabase
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

  // Update local storage when category list changes
  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categoryList));
      console.log("Categories saved to localStorage:", categoryList);
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
      toast.error("Erro ao salvar categorias");
    }
  }, [categoryList]);

  return {
    categoryList,
    setCategoryList,
    isLoading,
    setIsLoading
  };
};

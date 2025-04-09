
import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

/**
 * Core hook for managing category data state and loading
 */
export const useCategoriesCore = () => {
  const [categoryList, setCategoryList] = useState<TransactionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from API on init
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        
        // Use category service to fetch from API
        const categories = await categoryService.getCategories();
        
        // Log fetched categories to help debug
        console.log("Categorias carregadas da API:", categories);
        
        // Update state with API data
        setCategoryList(categories);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Error fetching categories from the API");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return {
    categoryList,
    setCategoryList,
    isLoading,
    setIsLoading
  };
};

import { useState, useEffect } from "react";
import { TransactionCategory } from "@/utils/mockData";
import { defaultCategories } from "@/utils/defaultCategories";
import { toast } from "sonner";
import { categoryService } from "@/services/api/category/CategoryService";

// Mock categories storage
const mockCategories: TransactionCategory[] = [];

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

  // Load categories on init
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        
        // Check if there are categories in mock storage
        if (mockCategories.length > 0) {
          console.log("Categories loaded from mock storage:", mockCategories);
          setCategoryList(mockCategories);
        } else {
          // Otherwise use local ones
          console.log("No categories found in mock storage, using local categories...");
          const localCategories = initCategories();
          
          // Add to mock storage
          mockCategories.push(...localCategories);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Error fetching categories from the database");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Update local storage when category list changes
  useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categoryList));
      console.log("Categories saved to localStorage:", categoryList);
    } catch (error) {
      console.error("Error saving categories to localStorage:", error);
      toast.error("Error saving categories");
    }
  }, [categoryList]);

  return {
    categoryList,
    setCategoryList,
    isLoading,
    setIsLoading
  };
};

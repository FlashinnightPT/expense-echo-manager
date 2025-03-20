
import { useState, useEffect } from "react";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { apiService } from "@/services/apiService";
import { toast } from "sonner";

export const useDataFetching = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from API service
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [transactionsData, categoriesData] = await Promise.all([
          apiService.getTransactions(),
          apiService.getCategories()
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Adicionar listener para eventos de storage
    const handleStorageChange = () => {
      console.log("Storage changed, updating data");
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    transactions,
    categories,
    isLoading,
    setTransactions,
    setCategories
  };
};

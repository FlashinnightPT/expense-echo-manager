
import { toast } from "sonner";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { dbToCategoryModel, dbToTransactionModel, categoryModelToDb, transactionModelToDb, dbToUserModel, userModelToDb } from "./supabaseAdapters";

// Mock data storage
const mockData = {
  transactions: [] as Transaction[],
  categories: [] as TransactionCategory[],
  users: [] as any[]
};

type DatabaseBackup = {
  transactions: Transaction[];
  categories: TransactionCategory[];
  users: any[];
  timestamp: number;
  version: string;
};

/**
 * Exports all data to a JSON file
 */
export const exportDatabase = async () => {
  try {
    // Use mock data instead of Supabase
    const transactions = [...mockData.transactions];
    const categories = [...mockData.categories];
    const users = [...mockData.users];
    
    // Create backup object
    const backup: DatabaseBackup = {
      transactions: transactions,
      categories: categories,
      users: users,
      timestamp: Date.now(),
      version: "1.0"
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(backup, null, 2);
    
    // Create blob and generate URL
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create link element for download
    const link = document.createElement('a');
    link.href = url;
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    link.setAttribute('download', `gestor-financeiro-backup-${dateStr}.json`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Backup exportado com sucesso");
    return true;
    
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    toast.error("Erro ao exportar dados: " + (error instanceof Error ? error.message : String(error)));
    return false;
  }
};

/**
 * Imports data from a JSON file
 */
export const importDatabase = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (!e.target || !e.target.result) {
            toast.error("Erro ao ler arquivo");
            reject(false);
            return;
          }
          
          const data = e.target.result as string;
          const backup = JSON.parse(data) as DatabaseBackup;
          
          // Validate backup format
          if (!backup.transactions || !backup.categories || !backup.timestamp || !backup.version) {
            toast.error("Formato de arquivo de backup inválido");
            reject(false);
            return;
          }
          
          toast.info("Importando dados...");
          
          // Clear existing mock data
          mockData.transactions = [];
          mockData.categories = [];
          mockData.users = [];
          
          // Import categories
          mockData.categories = [...backup.categories];
          
          // Import transactions
          mockData.transactions = [...backup.transactions];
          
          // Import users
          if (backup.users && Array.isArray(backup.users)) {
            mockData.users = [...backup.users];
            
            // Store in localStorage for offline access
            localStorage.setItem('app_users', JSON.stringify(backup.users));
          }
          
          // Trigger storage event to update application
          window.dispatchEvent(new Event('storage'));
          
          toast.success("Dados importados com sucesso");
          resolve(true);
          
        } catch (error) {
          console.error("Erro ao processar arquivo:", error);
          toast.error("Erro ao processar arquivo: " + (error instanceof Error ? error.message : String(error)));
          reject(false);
        }
      };
      
      reader.onerror = () => {
        toast.error("Erro ao ler arquivo");
        reject(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      toast.error("Erro ao importar dados: " + (error instanceof Error ? error.message : String(error)));
      reject(false);
    }
  });
};

/**
 * Clears all data
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    toast.info("Limpando todos os dados...");
    
    // Clear all mock data
    mockData.transactions = [];
    mockData.categories = [];
    mockData.users = [];
    
    // Clear localStorage
    localStorage.removeItem('app_users');
    
    // Trigger event for components to update
    window.dispatchEvent(new Event('storage'));
    
    toast.success("Todos os dados foram limpos com sucesso");
    return true;
    
  } catch (error) {
    console.error("Erro ao limpar todos os dados:", error);
    toast.error("Erro ao limpar dados: " + (error instanceof Error ? error.message : String(error)));
    return false;
  }
};

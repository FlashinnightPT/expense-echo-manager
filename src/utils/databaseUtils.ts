
import { toast } from "sonner";
import { Transaction, TransactionCategory } from "@/utils/mockData";

type DatabaseBackup = {
  transactions: Transaction[];
  categories: TransactionCategory[];
  users: any[]; // Adicionando users ao tipo de backup
  timestamp: number;
  version: string;
};

/**
 * Exporta todos os dados do localStorage para um arquivo JSON
 */
export const exportDatabase = () => {
  try {
    // Obter dados do localStorage
    const transactions = localStorage.getItem('transactions');
    const categories = localStorage.getItem('categories');
    const users = localStorage.getItem('app_users');
    
    if (!transactions || !categories) {
      toast.error("Não foi possível encontrar os dados para exportação");
      return;
    }
    
    // Criar o objeto de backup
    const backup: DatabaseBackup = {
      transactions: JSON.parse(transactions),
      categories: JSON.parse(categories),
      users: users ? JSON.parse(users) : [],
      timestamp: Date.now(),
      version: "1.0"
    };
    
    // Converter para string JSON
    const jsonString = JSON.stringify(backup, null, 2);
    
    // Criar o blob e gerar URL
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Criar elemento de link para download
    const link = document.createElement('a');
    link.href = url;
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    link.setAttribute('download', `gestor-financeiro-backup-${dateStr}.json`);
    document.body.appendChild(link);
    
    // Disparar o download
    link.click();
    
    // Limpar
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
 * Importa dados de um arquivo JSON para o localStorage
 */
export const importDatabase = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target || !e.target.result) {
            toast.error("Erro ao ler arquivo");
            reject(false);
            return;
          }
          
          const data = e.target.result as string;
          const backup = JSON.parse(data) as DatabaseBackup;
          
          // Validar o formato do backup
          if (!backup.transactions || !backup.categories || !backup.timestamp || !backup.version) {
            toast.error("Formato de arquivo de backup inválido");
            reject(false);
            return;
          }
          
          // Salvar os dados no localStorage
          localStorage.setItem('transactions', JSON.stringify(backup.transactions));
          localStorage.setItem('categories', JSON.stringify(backup.categories));
          
          // Importar dados de usuários se existirem
          if (backup.users && Array.isArray(backup.users)) {
            localStorage.setItem('app_users', JSON.stringify(backup.users));
          }
          
          // Disparar evento de storage para atualizar a aplicação
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

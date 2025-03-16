
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";

// Esta é uma classe simulada de API que pode ser adaptada para um backend real no futuro
// Atualmente usa localStorage, mas poderia ser modificada para usar fetch/axios
export class ApiService {
  private static instance: ApiService;
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    // Monitorar o estado da conexão
    window.addEventListener('online', () => {
      this.isOnline = true;
      toast.success("Conexão com o servidor restaurada");
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      toast.warning("Sem conexão com o servidor. Modo offline ativado.");
    });
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Método para simular a sincronização com o backend quando voltar online
  private syncData() {
    console.log("Sincronizando dados com o servidor...");
    // Aqui seria implementada a sincronização real com o backend
  }

  // Métodos para transações
  public async getTransactions(): Promise<Transaction[]> {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedTransactions = localStorage.getItem('transactions');
        const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        resolve(transactions);
      }, 300); // Simula um pequeno delay de rede
    });
  }

  public async saveTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    // Simula uma chamada de API POST
    return new Promise((resolve) => {
      setTimeout(async () => {
        const transactions = await this.getTransactions();
        
        const newTransaction: Transaction = {
          id: `transaction-${Date.now()}`,
          description: transaction.description || (transaction.type === "income" ? "Receita" : "Despesa"),
          amount: transaction.amount || 0,
          date: transaction.date || new Date().toISOString().split('T')[0],
          categoryId: transaction.categoryId || "",
          type: transaction.type || "expense"
        };
        
        const updatedTransactions = [...transactions, newTransaction];
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        resolve(newTransaction);
      }, 500); // Simula um pequeno delay de rede
    });
  }

  public async deleteTransaction(transactionId: string): Promise<boolean> {
    // Simula uma chamada de API DELETE
    return new Promise((resolve) => {
      setTimeout(async () => {
        const transactions = await this.getTransactions();
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        resolve(true);
      }, 500); // Simula um pequeno delay de rede
    });
  }

  // Métodos para categorias
  public async getCategories(): Promise<TransactionCategory[]> {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedCategories = localStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        resolve(categories);
      }, 300); // Simula um pequeno delay de rede
    });
  }

  public async saveCategory(category: Partial<TransactionCategory>): Promise<TransactionCategory> {
    // Simula uma chamada de API POST
    return new Promise((resolve) => {
      setTimeout(async () => {
        const categories = await this.getCategories();
        
        const newCategory: TransactionCategory = {
          id: `${category.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: category.name || "",
          type: category.type || "expense",
          level: category.level || 1,
          parentId: category.parentId,
        };
        
        const updatedCategories = [...categories, newCategory];
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        
        // Simula evento para outros componentes
        window.dispatchEvent(new Event('storage'));
        
        resolve(newCategory);
      }, 500); // Simula um pequeno delay de rede
    });
  }

  // Exportar e importar dados (backup)
  public async exportDatabase(): Promise<boolean> {
    try {
      // Reutiliza a função existente
      const transactions = await this.getTransactions();
      const categories = await this.getCategories();
      const users = localStorage.getItem('app_users');
      
      // Criar o objeto de backup
      const backup = {
        transactions,
        categories,
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
  }

  public async importDatabase(file: File): Promise<boolean> {
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
            const backup = JSON.parse(data);
            
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
  }

  // Método para verificar a conexão
  public isConnected(): boolean {
    return this.isOnline;
  }
}

// Exporta a instância singleton
export const apiService = ApiService.getInstance();


import { toast } from "sonner";
import { ApiServiceCore } from "./ApiServiceCore";
import { transactionService } from "./TransactionService";
import { categoryService } from "./CategoryService";
import { supabase } from "../supabaseClient";

// Service specifically for backup/restore operations
export class BackupService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): BackupService {
    return ApiServiceCore.getOrCreateInstance.call(BackupService);
  }

  public async exportDatabase(): Promise<boolean> {
    try {
      // Obter dados do Supabase se estiver conectado, ou do localStorage caso contrário
      const transactions = await transactionService.getTransactions();
      const categories = await categoryService.getCategories();
      const users = localStorage.getItem('app_users');
      
      // Criar o objeto de backup
      const backup = {
        transactions,
        categories,
        users: users ? JSON.parse(users) : [],
        timestamp: Date.now(),
        version: "1.0",
        source: this.isConnected() ? "supabase" : "localStorage"
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
      const fileName = `gestor-financeiro-backup-${dateStr}.json`;
      link.setAttribute('download', fileName);
      
      // Garantir que o link seja visível e receba foco
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Notificar o usuário antes de iniciar o download
      toast.info("Iniciando download do backup...");
      
      // Usar setTimeout para garantir que o toast seja exibido antes do download
      setTimeout(() => {
        // Disparar o download
        link.click();
        
        // Limpar
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success(
          `Backup "${fileName}" exportado com sucesso! Verifique a barra de downloads do seu navegador.`,
          { duration: 10000 }
        );
        
        // Registrar no console para depuração
        console.log(`Backup exportado: ${fileName}`);
      }, 1000);
      
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
        
        reader.onload = async (e) => {
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
            
            // Se estiver conectado ao Supabase, fazer upload para o banco de dados
            if (this.isConnected()) {
              toast.info("Importando dados para o Supabase...");
              
              // Limpar tabelas existentes
              await supabase.from('transactions').delete().neq('id', 'dummy');
              await supabase.from('categories').delete().neq('id', 'dummy');
              
              // Importar categorias
              if (backup.categories && backup.categories.length > 0) {
                const { error: catError } = await supabase
                  .from('categories')
                  .insert(backup.categories);
                
                if (catError) {
                  console.error("Erro ao importar categorias:", catError);
                  toast.error("Erro ao importar categorias para o Supabase");
                }
              }
              
              // Importar transações
              if (backup.transactions && backup.transactions.length > 0) {
                const { error: transError } = await supabase
                  .from('transactions')
                  .insert(backup.transactions);
                
                if (transError) {
                  console.error("Erro ao importar transações:", transError);
                  toast.error("Erro ao importar transações para o Supabase");
                }
              }
            }
            
            // Sempre atualizar o localStorage como cache
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
}

// Exporta a instância singleton
export const backupService = BackupService.getInstance();

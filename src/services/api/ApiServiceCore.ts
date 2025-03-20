
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Core API Service class com funcionalidade para Supabase e fallback para localStorage
export class ApiServiceCore {
  // Using protected instead of private to allow proper inheritance
  protected static instances: Record<string, any> = {};
  protected connected: boolean = false;
  protected pendingOperations: Array<() => Promise<void>> = [];

  protected constructor() {
    // Inicializar verificação de conexão
    this.checkConnection();
    
    // Monitorar o estado da conexão
    window.addEventListener('online', () => {
      toast.success("Conexão com o servidor restaurada");
      this.checkConnection();
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.connected = false;
      toast.warning("Sem conexão com o servidor. Modo offline ativado.");
    });
  }

  // Generic getInstance method to be used by child classes
  protected static getOrCreateInstance<T extends ApiServiceCore>(
    this: new () => T
  ): T {
    const className = this.name;
    if (!ApiServiceCore.instances[className]) {
      ApiServiceCore.instances[className] = new this();
    }
    return ApiServiceCore.instances[className] as T;
  }

  // Verificar conexão com o Supabase
  protected async checkConnection(): Promise<void> {
    try {
      const { data, error } = await supabase.from('transactions').select('count');
      this.connected = !error;
      console.log(`Supabase connection status: ${this.connected ? 'Connected' : 'Disconnected'}`);
    } catch (error) {
      this.connected = false;
      console.error("Error checking Supabase connection:", error);
    }
  }

  // Método para sincronizar dados pendentes quando voltar online
  protected async syncData(): Promise<void> {
    if (!this.connected) return;
    
    console.log("Sincronizando dados pendentes com o servidor...");
    
    // Executar operações pendentes
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];
    
    for (const operation of operations) {
      try {
        await operation();
      } catch (error) {
        console.error("Erro ao sincronizar operação:", error);
        // Readicionar operação à fila se falhar
        this.pendingOperations.push(operation);
      }
    }
    
    if (this.pendingOperations.length > 0) {
      toast.warning(`${this.pendingOperations.length} operações não puderam ser sincronizadas.`);
    } else if (operations.length > 0) {
      toast.success("Dados sincronizados com sucesso!");
    }
  }

  // Método para verificar a conexão atual
  public isConnected(): boolean {
    return this.connected && navigator.onLine;
  }
  
  // Método para adicionar operação à fila quando offline - now public
  public addPendingOperation(operation: () => Promise<void>): void {
    this.pendingOperations.push(operation);
    toast.info("Operação guardada para sincronização posterior");
  }
}


import { toast } from "sonner";

// Core API Service class with basic functionality and connection management
export class ApiServiceCore {
  // Using protected instead of private to allow proper inheritance
  protected static instances: Record<string, any> = {};

  protected constructor() {
    // Monitorar o estado da conexão
    window.addEventListener('online', () => {
      toast.success("Conexão com o servidor restaurada");
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
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

  // Método para simular a sincronização com o backend quando voltar online
  protected syncData() {
    console.log("Sincronizando dados com o servidor...");
    // Aqui seria implementada a sincronização real com o backend
  }

  // Método para verificar a conexão
  public isConnected(): boolean {
    return navigator.onLine;
  }
}

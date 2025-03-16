
import { toast } from "sonner";

// Core API Service class with basic functionality and connection management
export class ApiServiceCore {
  private static instance: ApiServiceCore;

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

  public static getInstance(): ApiServiceCore {
    if (!ApiServiceCore.instance) {
      ApiServiceCore.instance = new ApiServiceCore();
    }
    return ApiServiceCore.instance;
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

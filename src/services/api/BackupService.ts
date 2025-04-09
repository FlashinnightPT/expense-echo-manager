
import { toast } from "sonner";
import { ApiServiceCore } from "./ApiServiceCore";

// Service for backup operations through the API
export class BackupService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): BackupService {
    return ApiServiceCore.getOrCreateInstance.call(BackupService);
  }

  public async exportDatabase(): Promise<boolean> {
    try {
      // Request database export through API
      const response = await this.apiGet<{ success: boolean, fileUrl?: string }>('/backup/export');
      
      if (response.success && response.fileUrl) {
        // Create a temporary anchor to download the file
        const a = document.createElement('a');
        a.href = response.fileUrl;
        a.download = `gestor-financeiro-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Backup exportado com sucesso");
        return true;
      } else {
        toast.error("Erro ao exportar backup");
        return false;
      }
    } catch (error) {
      console.error("Error exporting database:", error);
      toast.error("Erro ao exportar backup");
      return false;
    }
  }
  
  public async importDatabase(file: File): Promise<boolean> {
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('backupFile', file);
      
      // Custom fetch since we're sending a file
      const apiUrl = this.apiBaseUrl;
      const response = await fetch(`${apiUrl}/backup/import`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success) {
        toast.success("Dados importados com sucesso");
        return true;
      } else {
        toast.error(result.message || "Erro ao importar dados");
        return false;
      }
    } catch (error) {
      console.error("Error importing database:", error);
      toast.error("Erro ao importar dados");
      return false;
    }
  }
}

// Export singleton instance
export const backupService = BackupService.getInstance();

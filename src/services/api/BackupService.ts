
// Mock BackupService (Supabase references removed)
import { toast } from "sonner";
import { ApiServiceCore } from "./ApiServiceCore";
import { exportDatabase, importDatabase } from "@/utils/databaseUtils";

// Service for backup operations
export class BackupService extends ApiServiceCore {
  private constructor() {
    super();
  }

  public static getInstance(): BackupService {
    return ApiServiceCore.getOrCreateInstance.call(BackupService);
  }

  public async exportDatabase(): Promise<boolean> {
    return exportDatabase();
  }
  
  public async importDatabase(file: File): Promise<boolean> {
    return importDatabase(file);
  }
}

// Export singleton instance
export const backupService = BackupService.getInstance();

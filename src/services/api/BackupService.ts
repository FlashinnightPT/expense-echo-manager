
// Import the supabase client from the correct location
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiServiceCore } from "./ApiServiceCore";
import { exportDatabase, importDatabase } from "@/utils/databaseUtils";

// Service specifically for backup operations
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

// Export the singleton instance
export const backupService = BackupService.getInstance();

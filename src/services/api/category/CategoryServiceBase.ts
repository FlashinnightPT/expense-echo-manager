
import { ApiServiceCore } from "../ApiServiceCore";
import { query, tableExists } from "@/integrations/mariadb/client";
import { toast } from "sonner";

// Base class for category operations containing shared functionality
export class CategoryServiceBase extends ApiServiceCore {
  protected constructor() {
    super();
    this.ensureTableExists();
  }

  // Ensure the categories table exists in MariaDB
  protected async ensureTableExists(): Promise<void> {
    try {
      const exists = await tableExists('categories');
      
      if (!exists) {
        console.warn('Categories table does not exist, creating it...');
        await query(`
          CREATE TABLE categories (
            id VARCHAR(255) PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            parentid VARCHAR(255),
            level INT NOT NULL DEFAULT 1,
            createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            isactive TINYINT(1) DEFAULT 1,
            isfixedexpense TINYINT(1) DEFAULT 0
          )
        `);
        console.log('Categories table created successfully');
      }
    } catch (error) {
      console.error('Error checking/creating categories table:', error);
    }
  }
}

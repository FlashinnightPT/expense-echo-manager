
import { ApiServiceCore } from "../ApiServiceCore";
import { toast } from "sonner";

// Base class for category operations containing shared functionality
export class CategoryServiceBase extends ApiServiceCore {
  protected constructor() {
    super();
  }
  
  // Helper method to sanitize values for database operations
  // Converts undefined values to null for MySQL compatibility
  protected sanitizeForDb(value: any): any {
    return value === undefined ? null : value;
  }
}


import { useAuth, AuthProvider, RequireAuth, RequireEditor } from "./auth";
import type { User, UserRole, AuthContextType } from "./auth";

// Re-export all functionality from the modular implementation
export { useAuth, AuthProvider, RequireAuth, RequireEditor };
export type { User, UserRole, AuthContextType };

export default useAuth;

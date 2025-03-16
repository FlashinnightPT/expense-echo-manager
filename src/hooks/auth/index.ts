
// Export all auth-related hooks and components
import { useAuthContext } from "./useAuthContext";
import AuthProvider from "./AuthProvider";
import { RequireAuth, RequireEditor } from "./AuthGuards";
import { UserRole, User, AuthContextType } from "./types";

// Main hook to use auth functionality
const useAuth = useAuthContext;

export {
  useAuth,
  AuthProvider,
  RequireAuth,
  RequireEditor
};

// Re-export types
export type { UserRole, User, AuthContextType };

// Default export for backward compatibility
export default useAuth;

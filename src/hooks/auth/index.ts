
// Export all auth related functionality
import AuthContext, { useAuth } from "./useAuthContext";
import { AuthProvider } from "./AuthProvider";
import { RequireAuth, RequireEditor } from "./AuthGuards";
import { UserRole, User, AuthContextType } from "./types";

export {
  useAuth,
  AuthProvider,
  RequireAuth,
  RequireEditor,
  AuthContext
};

export type { UserRole, User, AuthContextType };

export default useAuth;

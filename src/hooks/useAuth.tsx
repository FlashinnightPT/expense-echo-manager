
// This file is kept for backward compatibility
// It re-exports everything from the new auth module
import { 
  useAuth,
  AuthProvider, 
  RequireAuth, 
  RequireEditor,
  UserRole,
  User,
  AuthContextType
} from "./auth";

export { 
  useAuth,
  AuthProvider, 
  RequireAuth, 
  RequireEditor 
};

export type { UserRole, User, AuthContextType };

export default useAuth;

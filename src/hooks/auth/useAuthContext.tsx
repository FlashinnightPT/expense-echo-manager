
import { createContext, useContext } from "react";
import { AuthContextType } from "./types";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Export useAuth as an alias of useAuthContext for backward compatibility
export const useAuth = useAuthContext;

export default AuthContext;

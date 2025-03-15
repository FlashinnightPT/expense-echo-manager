
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./useAuthProvider";

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

/**
 * Initialize default admin user if no users exist
 */
export const useInitializeAuth = () => {
  useEffect(() => {
    // Verificar se existem utilizadores e criar um utilizador padrão se não existir nenhum
    const savedUsers = localStorage.getItem("app_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (users.length === 0) {
      // Criar utilizador admin padrão se não existir nenhum utilizador
      const defaultAdmin = {
        id: "1",
        name: "Administrador",
        username: "admin",
        role: "editor",
        status: "active",
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem("app_users", JSON.stringify([defaultAdmin]));
    }
    
    // Verificar se o utilizador já está autenticado
    const currentUser = sessionStorage.getItem("current_user");
    if (currentUser) {
      // Auto login handling would happen in the provider
    }
  }, []);
};

// Reexport AuthProvider for convenience
export { AuthProvider };

// Export auth guards
export { RequireAuth, RequireEditor } from "./authGuards";

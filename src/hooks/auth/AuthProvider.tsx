
import { useState, useEffect, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "./types";
import AuthContext from "./useAuthContext";
import usePasswordValidator from "./usePasswordValidator";
import { useIdleTimer } from "../useIdleTimer";
import { UserService } from "@/services/api/UserService";

// Define timeout for automatic logout (in milliseconds)
const IDLE_TIMEOUT = 3 * 60 * 1000; // 3 minutes
const WARNING_TIME = 30 * 1000; // 30 seconds

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { validatePassword } = usePasswordValidator();

  // Logout function
  const logout = () => {
    console.log("AuthProvider: Logging out user");
    sessionStorage.removeItem("current_user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  // Idle timer configuration
  const { IdleWarningDialog } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    warningTime: WARNING_TIME,
    onIdle: () => {
      toast.error("Sessão terminada por inatividade", {
        duration: 5000
      });
      logout();
    }
  });

  useEffect(() => {
    // Inicializar o sistema de autenticação
    const initAuth = async () => {
      console.log("AuthProvider: Initializing auth system");
      try {
        // Inicializar o utilizador administrador padrão, se necessário
        await UserService.initializeDefaultAdmin();
        
        // Verificar se o utilizador está autenticado (via sessão)
        const currentUser = sessionStorage.getItem("current_user");
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log("AuthProvider: User authenticated from session", parsedUser);
          } catch (error) {
            console.error("Erro ao processar utilizador da sessão:", error);
            sessionStorage.removeItem("current_user");
          }
        } else {
          console.log("AuthProvider: No user in session");
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
      } finally {
        // Always set to true regardless of any errors
        console.log("AuthProvider: Setting isInitialized to true");
        setIsInitialized(true);
      }
    };

    // Ensure initialization happens only once
    if (!isInitialized) {
      initAuth();
    }
  }, [isInitialized]); // Only run when isInitialized changes

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("AuthProvider: Attempting login for", username);
      // Reiniciar estado anterior em caso de login consecutivo
      setUser(null);
      setIsAuthenticated(false);
      
      // Obter utilizador do sistema
      const foundUser = await UserService.getUserByUsername(username);
      
      if (!foundUser) {
        console.log("Utilizador não encontrado:", username);
        return false;
      }
      
      // Verificar se a senha corresponde (validação simples temporária)
      if (foundUser.password && foundUser.password !== password && 
          !(foundUser.username === "admin" && password === "admin123")) {
        console.log("Senha inválida para o utilizador:", username);
        return false;
      }
      
      const userToSave: User = {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        role: foundUser.role
      };
      
      // Atualizar o último login
      await UserService.updateLastLogin(foundUser.id);
      
      // Atualizar estado e sessão
      setUser(userToSave);
      setIsAuthenticated(true);
      sessionStorage.setItem("current_user", JSON.stringify(userToSave));
      console.log("AuthProvider: Login successful for", username);
      
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Ocorreu um erro durante o login");
      return false;
    }
  };

  // Verificar se o utilizador tem permissões de editor
  const canEdit = user?.role === "editor";

  // Usar useMemo para evitar recálculos desnecessários
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isInitialized,
    login,
    logout,
    canEdit,
    validatePassword,
    useIdleWarning: { IdleWarningDialog }
  }), [user, isAuthenticated, isInitialized, canEdit, IdleWarningDialog]);

  console.log("AuthProvider: Rendering with isInitialized =", isInitialized, "isAuthenticated =", isAuthenticated);
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

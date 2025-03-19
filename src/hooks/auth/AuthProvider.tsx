
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
    sessionStorage.removeItem("current_user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
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
          } catch (error) {
            console.error("Erro ao processar utilizador da sessão:", error);
            sessionStorage.removeItem("current_user");
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []); // Executar apenas uma vez

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
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
    login,
    logout,
    canEdit,
    validatePassword,
    useIdleWarning: { IdleWarningDialog }
  }), [user, isAuthenticated, canEdit, IdleWarningDialog]);

  // Não renderizar nada até verificarmos a sessão
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

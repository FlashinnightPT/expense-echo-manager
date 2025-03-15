
import { useState, createContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, UserRole, AuthContextType } from "./types";
import { useIdleTimer } from "../useIdleTimer";
import { validatePassword } from "./passwordUtils";

// Definição do tempo para logout automático (em milissegundos)
const IDLE_TIMEOUT = 3 * 60 * 1000; // 3 minutos
const WARNING_TIME = 30 * 1000; // 30 segundos

// Create context with undefined as initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Função de logout
  const logout = () => {
    sessionStorage.removeItem("current_user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Configuração do idle timer
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Buscar utilizadores do localStorage
      const savedUsers = localStorage.getItem("app_users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      const foundUser = users.find((u: any) => u.username === username);
      
      if (!foundUser) {
        return false;
      }
      
      // Para o utilizador padrão, permitir acesso com a senha "admin123"
      if (foundUser.username === "admin" && password === "admin123") {
        const userToSave: User = {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          role: foundUser.role
        };
        
        setUser(userToSave);
        setIsAuthenticated(true);
        sessionStorage.setItem("current_user", JSON.stringify(userToSave));
        
        return true;
      }
      
      // Nota: Numa aplicação real, verificaria a senha com hash
      // Esta é apenas uma simulação
      
      const userToSave: User = {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        role: foundUser.role
      };
      
      // Atualizar o último login
      const updatedUsers = users.map((u: any) => {
        if (u.username === username) {
          return {
            ...u,
            status: "active",
            lastLogin: new Date().toISOString()
          };
        }
        return u;
      });
      
      localStorage.setItem("app_users", JSON.stringify(updatedUsers));
      
      setUser(userToSave);
      setIsAuthenticated(true);
      sessionStorage.setItem("current_user", JSON.stringify(userToSave));
      
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  // Verificar se o utilizador tem permissões de edição
  const canEdit = user?.role === "editor";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        canEdit,
        validatePassword,
        useIdleWarning: { IdleWarningDialog }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

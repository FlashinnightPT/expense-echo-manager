import { useEffect, useState, createContext, useContext, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "./useIdleTimer";
import { toast } from "sonner";

// Tipos
export type UserRole = "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  canEdit: boolean;
  validatePassword: (password: string) => { isValid: boolean; errors: string[] };
  useIdleWarning: { IdleWarningDialog: () => JSX.Element };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Definição do tempo para logout automático (em milissegundos)
const IDLE_TIMEOUT = 3 * 60 * 1000; // 3 minutos
const WARNING_TIME = 30 * 1000; // 30 segundos

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

  useEffect(() => {
    // Verificar se existem utilizadores e criar um utilizador padrão se não existir nenhum
    const savedUsers = localStorage.getItem("app_users");
    if (!savedUsers || JSON.parse(savedUsers).length === 0) {
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
      console.log("Usuário administrador padrão criado");
    }

    // Verificar se o utilizador já está autenticado
    const currentUser = sessionStorage.getItem("current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
      setIsAuthenticated(true);
    }
  }, []); // Dependência vazia para garantir que só executa uma vez

  // Função para validar a senha conforme os requisitos
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("A senha deve ter pelo menos 8 caracteres");
    }
    
    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 2) {
      errors.push("A senha deve ter pelo menos duas letras");
    }
    
    if (!password.match(/[A-Z]/)) {
      errors.push("A senha deve ter pelo menos uma letra maiúscula");
    }
    
    if (!password.match(/[a-z]/)) {
      errors.push("A senha deve ter pelo menos uma letra minúscula");
    }
    
    const numberCount = (password.match(/[0-9]/g) || []).length;
    if (numberCount < 2) {
      errors.push("A senha deve ter pelo menos dois números");
    }
    
    if (!password.match(/[!€@.*]/)) {
      errors.push("A senha deve ter pelo menos um caractere especial (!,€,@,.,*)");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Buscar utilizadores do localStorage
      const savedUsers = localStorage.getItem("app_users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      // Se não houver usuários, cria o usuário padrão
      if (users.length === 0) {
        const defaultAdmin = {
          id: "1",
          name: "Administrador",
          username: "admin",
          role: "editor",
          status: "active",
          lastLogin: new Date().toISOString()
        };
        users.push(defaultAdmin);
        localStorage.setItem("app_users", JSON.stringify(users));
      }
      
      const foundUser = users.find((u: any) => u.username === username);
      
      if (!foundUser) {
        console.log("Usuário não encontrado:", username);
        console.log("Usuários disponíveis:", users);
        return false;
      }
      
      // Para todos os utilizadores - aceitar qualquer senha como válida (simplificação)
      // Em um sistema real, você verificaria senhas com hash
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

  // Use useMemo para evitar recálculos desnecessários
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    canEdit,
    validatePassword,
    useIdleWarning: { IdleWarningDialog }
  }), [user, isAuthenticated, canEdit, IdleWarningDialog]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Componente para verificar autenticação
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Componente para verificar permissões de edição
export const RequireEditor = ({ children }: { children: ReactNode }) => {
  const { canEdit, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!canEdit) {
      navigate("/dashboard");
    }
  }, [canEdit, isAuthenticated, navigate]);

  if (!isAuthenticated || !canEdit) {
    return null;
  }

  return <>{children}</>;
};

export default useAuth;

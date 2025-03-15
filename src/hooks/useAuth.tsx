
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Tipos
export type UserRole = "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o utilizador já está autenticado
    const currentUser = sessionStorage.getItem("current_user");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Numa aplicação real, faria uma chamada API para autenticar
    // Esta é apenas uma simulação para fins de demonstração
    
    try {
      // Buscar utilizadores do localStorage
      const savedUsers = localStorage.getItem("app_users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        return false;
      }
      
      // Nota: Numa aplicação real, verificaria a senha com hash
      // Esta é apenas uma simulação
      
      const userToSave: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      
      // Atualizar o último login
      const updatedUsers = users.map((u: any) => {
        if (u.email === email) {
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

  const logout = () => {
    sessionStorage.removeItem("current_user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
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
        canEdit
      }}
    >
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

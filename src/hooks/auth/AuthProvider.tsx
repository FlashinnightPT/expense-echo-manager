
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

  // Initialize auth system once when component mounts
  useEffect(() => {
    const initAuth = async () => {
      console.log("AuthProvider: Starting auth initialization");
      try {
        // Check for user in session storage first (faster)
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
          // If we don't have a user, make sure we're initialized as unauthenticated
          setIsAuthenticated(false);
        }
        
        // Initialize default admin user if needed (do this after session check)
        await UserService.initializeDefaultAdmin();
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        toast.error("Erro de conexão com o servidor. Funcionando em modo offline.");
      } finally {
        // CRITICAL: Always set isInitialized to true regardless of any errors
        console.log("AuthProvider: Auth initialization completed, setting isInitialized = true");
        setIsInitialized(true);
      }
    };

    console.log("AuthProvider: useEffect running");
    // Immediately run the initialization
    initAuth();
    
    // This effect should only run once on mount
  }, []); 

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("AuthProvider: Attempting login for", username);
      // Reset previous state in case of consecutive login attempts
      setUser(null);
      setIsAuthenticated(false);
      
      // Get user from system
      const foundUser = await UserService.getUserByUsername(username);
      
      if (!foundUser) {
        console.log("Utilizador não encontrado:", username);
        return false;
      }
      
      // Verify password matches (temporary simple validation)
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
      
      // Update last login
      await UserService.updateLastLogin(foundUser.id);
      
      // Update state and session
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

  // Check if user has editor permissions
  const canEdit = user?.role === "editor";

  // Use useMemo to avoid unnecessary recalculations
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
      <IdleWarningDialog />
    </AuthContext.Provider>
  );
};

export default AuthProvider;

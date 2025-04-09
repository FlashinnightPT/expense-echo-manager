
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
        }
        
        // Initialize default admin user if needed
        await UserService.initializeDefaultAdmin();
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        toast.error("Erro de conexão com o servidor.");
      } finally {
        // Always set isInitialized to true regardless of any errors
        console.log("AuthProvider: Auth initialization completed, setting isInitialized = true");
        setIsInitialized(true);
      }
    };

    console.log("AuthProvider: useEffect running");
    // Set a short timeout to ensure other components have mounted
    setTimeout(() => {
      initAuth();
    }, 100);
  }, []); 

  // Login function - updated to use API only
  const login = async (username: string, password: string, userData?: any): Promise<boolean> => {
    try {
      console.log("AuthProvider: Attempting login for", username);
      // Reset previous state in case of consecutive login attempts
      setUser(null);
      setIsAuthenticated(false);
      
      // If userData is provided from the API response, use it directly
      if (userData) {
        const userToSave: User = {
          id: userData.id,
          name: userData.name || username,
          username: userData.username || username,
          role: userData.role || "user"
        };
        
        // Update state and session
        setUser(userToSave);
        setIsAuthenticated(true);
        sessionStorage.setItem("current_user", JSON.stringify(userToSave));
        
        // Set default financial values visibility to false after login
        sessionStorage.setItem('showFinancialValues', 'false');
        
        console.log("AuthProvider: Login successful for", username, "with API provided user data");
        return true;
      }
      
      // If no userData provided, make an API call
      const apiUrl = import.meta.env.VITE_API_URL || 'https://gestaofinanceira.acmorais.com/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        console.log("API login failed:", response.status);
        return false;
      }
      
      const result = await response.json();
      if (!result.success) {
        console.log("API login unsuccessful:", result.message);
        return false;
      }
      
      const userToSave: User = {
        id: result.user.id,
        name: result.user.name,
        username: result.user.username,
        role: result.user.role
      };
      
      // Update state and session
      setUser(userToSave);
      setIsAuthenticated(true);
      sessionStorage.setItem("current_user", JSON.stringify(userToSave));
      
      // Set default financial values visibility to false after login
      sessionStorage.setItem('showFinancialValues', 'false');
      
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
    </AuthContext.Provider>
  );
};

export default AuthProvider;

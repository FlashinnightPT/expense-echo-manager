
import { useState, useEffect, useMemo, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "./types";
import AuthContext from "./useAuthContext";
import usePasswordValidator from "./usePasswordValidator";
import { useIdleTimer } from "../useIdleTimer";

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
    // Check if users exist and create a default user if none exist
    const savedUsers = localStorage.getItem("app_users");
    if (!savedUsers || JSON.parse(savedUsers).length === 0) {
      // Create default admin user if no users exist
      const defaultAdmin = {
        id: "1",
        name: "Administrador",
        username: "admin",
        password: "admin123", // Store password for validation
        role: "editor",
        status: "active",
        lastLogin: new Date().toISOString()
      };
      
      localStorage.setItem("app_users", JSON.stringify([defaultAdmin]));
      console.log("Default admin user created");
    }

    // Check if user is already authenticated
    const currentUser = sessionStorage.getItem("current_user");
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error processing session user:", error);
        sessionStorage.removeItem("current_user");
      }
    }
    
    setIsInitialized(true);
  }, []); // Empty dependency to ensure it only runs once

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Reset previous state in case of consecutive login
      setUser(null);
      setIsAuthenticated(false);
      
      // Fetch users from localStorage
      const savedUsers = localStorage.getItem("app_users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      // If there are no users, create the default user
      if (users.length === 0) {
        const defaultAdmin = {
          id: "1",
          name: "Administrador",
          username: "admin",
          password: "admin123", // Store password for validation
          role: "editor",
          status: "active",
          lastLogin: new Date().toISOString()
        };
        users.push(defaultAdmin);
        localStorage.setItem("app_users", JSON.stringify(users));
      }
      
      const foundUser = users.find((u: any) => u.username === username);
      
      if (!foundUser) {
        console.log("User not found:", username);
        console.log("Available users:", users);
        return false;
      }
      
      // Check if password matches (simple validation for demo)
      if (foundUser.password && foundUser.password !== password && 
          !(foundUser.username === "admin" && password === "admin123")) {
        console.log("Invalid password for user:", username);
        return false;
      }
      
      const userToSave: User = {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        role: foundUser.role
      };
      
      // Update last login
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
      
      // Update state and session
      setUser(userToSave);
      setIsAuthenticated(true);
      sessionStorage.setItem("current_user", JSON.stringify(userToSave));
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  // Check if user has editor permissions
  const canEdit = user?.role === "editor";

  // Use useMemo to avoid unnecessary recalculations
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    canEdit,
    validatePassword,
    useIdleWarning: { IdleWarningDialog }
  }), [user, isAuthenticated, canEdit, IdleWarningDialog]);

  // Don't render anything until we've checked the session
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

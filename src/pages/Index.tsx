
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();

  // Redirect based on authentication status
  useEffect(() => {
    console.log("Index: Auth state", { isAuthenticated, isInitialized });
    
    // Only redirect once the auth is initialized
    if (isInitialized) {
      if (isAuthenticated) {
        console.log("Index: Redirecting to dashboard");
        // Use replace to avoid building up history stack
        navigate("/dashboard", { replace: true });
      } else {
        console.log("Index: Redirecting to login");
        // Use replace to avoid building up history stack
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, isInitialized]);

  // Show loading while initializing or redirecting
  return <LoadingPage text="Carregando aplicação..." />;
};

export default Index;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const [redirected, setRedirected] = useState(false);
  
  // Redirect based on authentication status
  useEffect(() => {
    console.log("Index: Auth state", { isAuthenticated, isInitialized, redirected });
    
    // Only redirect once the auth is initialized and we haven't redirected yet
    if (isInitialized && !redirected) {
      setRedirected(true); // Prevent multiple redirects
      
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
  }, [isAuthenticated, isInitialized, navigate, redirected]);

  if (!isInitialized) {
    return <LoadingPage text="Inicializando aplicação..." />;
  }

  // This ensures we show loading until redirection completes
  return <LoadingPage text="Carregando aplicação..." />;
};

export default Index;

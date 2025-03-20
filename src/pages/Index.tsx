
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { LoadingPage } from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  
  // Redirect based on authentication status
  useEffect(() => {
    console.log("Index: Auth state", { isAuthenticated, isInitialized, redirecting });
    
    if (isInitialized) {
      console.log("Index: Auth is initialized, redirecting now");
      setRedirecting(true);
      
      // Force redirect regardless of previous state
      if (isAuthenticated) {
        console.log("Index: User is authenticated, going to dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        console.log("Index: User is NOT authenticated, going to login");
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Show loading until redirect happens
  return <LoadingPage text="Inicializando aplicação..." />;
};

export default Index;
